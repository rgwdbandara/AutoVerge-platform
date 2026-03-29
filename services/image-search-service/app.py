from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import torch
import torchvision.models as models
import torchvision.transforms as transforms
import io
import requests

app = Flask(__name__)
CORS(app)

# ---------------------------------------------------
# Load pre-trained CNN model
# ---------------------------------------------------
model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
feature_extractor = torch.nn.Sequential(*list(model.children())[:-1])
feature_extractor.eval()

# ---------------------------------------------------
# Image preprocessing pipeline
# ---------------------------------------------------
preprocess = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

# ---------------------------------------------------
# Helper functions
# ---------------------------------------------------
def extract_image_features(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    input_tensor = preprocess(image).unsqueeze(0)

    with torch.no_grad():
        features = feature_extractor(input_tensor)

    feature_vector = features.squeeze().tolist()
    return feature_vector

def download_image_from_url(image_url):
    response = requests.get(image_url, timeout=15)
    response.raise_for_status()
    return response.content

# ---------------------------------------------------
# Routes
# ---------------------------------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Image Search CNN Service Running"
    })

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "service": "image-search-service",
        "model": "ResNet18 feature extractor"
    })

@app.route("/extract-features", methods=["POST"])
def extract_features():
    try:
        if "image" in request.files:
            image_file = request.files["image"]
            image_bytes = image_file.read()

            feature_vector = extract_image_features(image_bytes)

            return jsonify({
                "message": "Features extracted successfully from uploaded file",
                "source": "file",
                "filename": image_file.filename,
                "content_type": image_file.content_type,
                "feature_length": len(feature_vector),
                "feature_vector": feature_vector,
                "feature_vector_preview": feature_vector[:10]
            })

        data = request.get_json(silent=True)

        if data and data.get("imageUrl"):
            image_url = data.get("imageUrl")
            image_bytes = download_image_from_url(image_url)
            feature_vector = extract_image_features(image_bytes)

            return jsonify({
                "message": "Features extracted successfully from image URL",
                "source": "url",
                "image_url": image_url,
                "feature_length": len(feature_vector),
                "feature_vector": feature_vector,
                "feature_vector_preview": feature_vector[:10]
            })

        return jsonify({"message": "Image file or imageUrl is required"}), 400

    except Exception as e:
        return jsonify({
            "message": "Failed to process image",
            "error": str(e)
        }), 500

if __name__ == "__main__":
    app.run(port=5004, debug=True)