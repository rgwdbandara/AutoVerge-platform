from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import torch
import torchvision.models as models
import torchvision.transforms as transforms
import io
import requests
import cv2
import numpy as np

app = Flask(__name__)
CORS(app)

# ---------------------------------------------------
# Load pre-trained CNN model
# ---------------------------------------------------
MODEL_NAME = "resnet50"  

def load_feature_extractor(model_name):
    if model_name == "resnet18":
        model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
        feature_dim = 512

    elif model_name == "resnet50":
        model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
        feature_dim = 2048

    else:
        raise ValueError(f"Unsupported model name: {model_name}")

    feature_extractor = torch.nn.Sequential(*list(model.children())[:-1])
    feature_extractor.eval()

    return feature_extractor, feature_dim

feature_extractor, FEATURE_DIM = load_feature_extractor(MODEL_NAME)

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
    try:
        # smart crop try කරන්න
        cropped_image, crop_strategy = smart_edge_crop(image_bytes)

    except Exception as e:
        # fallback to center crop
        image = load_image_as_pil(image_bytes)
        cropped_image, crop_strategy = focused_crop_pil(image)
        crop_strategy = "fallback-center-crop"

    input_tensor = preprocess(cropped_image).unsqueeze(0)

    with torch.no_grad():
        features = feature_extractor(input_tensor)

    feature_vector = features.squeeze().tolist()

    return feature_vector, crop_strategy

def download_image_from_url(image_url):
    response = requests.get(image_url, timeout=15)
    response.raise_for_status()
    return response.content

def load_image_as_cv2(image_bytes):
    np_arr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if image is None:
        raise ValueError("Failed to decode image")

    return image


def detect_view_type_heuristic(image_bytes):
    image = load_image_as_cv2(image_bytes)
    height, width = image.shape[:2]

    if height == 0 or width == 0:
        return "unknown"

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Basic blur / detail estimate
    laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()

    # Edge map
    edges = cv2.Canny(gray, 100, 200)

    # Split into regions
    left_region = edges[:, : width // 3]
    center_region = edges[:, width // 3 : 2 * width // 3]
    right_region = edges[:, 2 * width // 3 :]

    left_edges = np.sum(left_region > 0)
    center_edges = np.sum(center_region > 0)
    right_edges = np.sum(right_region > 0)

    total_edges = left_edges + center_edges + right_edges

    if total_edges == 0:
        return "unknown"

    # Brightness analysis
    mean_brightness = np.mean(gray)

    # Aspect ratio
    aspect_ratio = width / height

    # Heuristic rules
    # 1. Very dark / low-detail images often unreliable
    if laplacian_var < 20:
        return "unknown"

    # 2. Interior guess: usually darker + cluttered center + low outer symmetry
    if mean_brightness < 90 and center_edges > (left_edges + right_edges) * 0.7:
        return "interior"

    # 3. Side guess: wide image with spread-out edges
    if aspect_ratio > 1.25 and center_edges < (left_edges + right_edges):
        return "side"

    # 4. Angled guess: center strong + one side slightly dominant
    if center_edges > left_edges and center_edges > right_edges:
        return "angled"

    return "unknown"


def detect_exterior_flag(view_type):
    return view_type != "interior"


def detect_body_type_hint_heuristic(image_bytes, view_type):
    image = load_image_as_cv2(image_bytes)
    height, width = image.shape[:2]

    if height == 0 or width == 0:
        return "unknown"

    aspect_ratio = width / height

    if view_type == "interior":
        return "unknown"

    if aspect_ratio > 1.6:
        return "van"

    if aspect_ratio > 1.35:
        return "sedan"

    if aspect_ratio > 1.15:
        return "hatchback"

    if aspect_ratio > 0.95:
        return "suv"

    return "unknown"


def load_image_as_pil(image_bytes):
    return Image.open(io.BytesIO(image_bytes)).convert("RGB")


def focused_crop_pil(image):
    width, height = image.size

    if width < 50 or height < 50:
        return image, "original"

    # center-focused crop
    left = int(width * 0.10)
    top = int(height * 0.10)
    right = int(width * 0.90)
    bottom = int(height * 0.90)

    cropped = image.crop((left, top, right, bottom))
    return cropped, "center-focused-crop"


def smart_edge_crop(image_bytes):
    image_cv = load_image_as_cv2(image_bytes)
    height, width = image_cv.shape[:2]

    if height < 60 or width < 60:
        pil_img = load_image_as_pil(image_bytes)
        return pil_img, "fallback-original"

    gray = cv2.cvtColor(image_cv, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 100, 200)

    # sliding window to find most "detailed" region
    window_size_w = int(width * 0.6)
    window_size_h = int(height * 0.6)

    max_score = -1
    best_box = (0, 0, width, height)

    step_x = int(width * 0.1)
    step_y = int(height * 0.1)

    for y in range(0, height - window_size_h, step_y):
        for x in range(0, width - window_size_w, step_x):
            window = edges[y:y+window_size_h, x:x+window_size_w]
            score = np.sum(window > 0)

            if score > max_score:
                max_score = score
                best_box = (x, y, x + window_size_w, y + window_size_h)

    # convert to PIL and crop
    pil_img = load_image_as_pil(image_bytes)
    cropped = pil_img.crop(best_box)

    return cropped, "edge-focused-crop"

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
        "model": MODEL_NAME,
        "feature_dimension": FEATURE_DIM
    })

@app.route("/extract-features", methods=["POST"])
def extract_features():
    try:
        if "image" in request.files:
            image_file = request.files["image"]
            image_bytes = image_file.read()

            feature_vector, crop_strategy = extract_image_features(image_bytes)

            return jsonify({
                "message": "Features extracted successfully from uploaded file",
                "source": "file",
                "filename": image_file.filename,
                "content_type": image_file.content_type,
                "feature_length": len(feature_vector),
                "crop_strategy": crop_strategy,
                "feature_vector": feature_vector,
                "feature_vector_preview": feature_vector[:10]
            })

        data = request.get_json(silent=True)

        if data and data.get("imageUrl"):
            image_url = data.get("imageUrl")
            image_bytes = download_image_from_url(image_url)
            feature_vector, crop_strategy = extract_image_features(image_bytes)

            return jsonify({
                "message": "Features extracted successfully from image URL",
                "source": "url",
                "image_url": image_url,
                "feature_length": len(feature_vector),
                "crop_strategy": crop_strategy,
                "feature_vector": feature_vector,
                "feature_vector_preview": feature_vector[:10]
            })

        return jsonify({"message": "Image file or imageUrl is required"}), 400

    except Exception as e:
        return jsonify({
            "message": "Failed to process image",
            "error": str(e)
        }), 500

@app.route("/detect-view-type", methods=["POST"])
def detect_view_type():
    try:
        image_bytes = None
        image_url = None

        if "image" in request.files:
            image_file = request.files["image"]
            image_bytes = image_file.read()

        else:
            data = request.get_json(silent=True)

            if not data or not data.get("imageUrl"):
                return jsonify({"message": "image or imageUrl is required"}), 400

            image_url = data.get("imageUrl")
            image_bytes = download_image_from_url(image_url)

        detected_view_type = detect_view_type_heuristic(image_bytes)

        return jsonify({
            "message": "View type detected successfully",
            "image_url": image_url,
            "view_type": detected_view_type
        })

    except Exception as e:
        return jsonify({
            "message": "Failed to detect view type",
            "error": str(e)
        }), 500

@app.route("/analyze-image-meta", methods=["POST"])
def analyze_image_meta():
    try:
        image_bytes = None
        image_url = None

        if "image" in request.files:
            image_file = request.files["image"]
            image_bytes = image_file.read()
        else:
            data = request.get_json(silent=True)

            if not data or not data.get("imageUrl"):
                return jsonify({"message": "image or imageUrl is required"}), 400

            image_url = data.get("imageUrl")
            image_bytes = download_image_from_url(image_url)

        view_type = detect_view_type_heuristic(image_bytes)
        is_exterior = detect_exterior_flag(view_type)
        body_type_hint = detect_body_type_hint_heuristic(image_bytes, view_type)

        return jsonify({
            "message": "Image meta analyzed successfully",
            "image_url": image_url,
            "view_type": view_type,
            "is_exterior": is_exterior,
            "body_type_hint": body_type_hint
        })

    except Exception as e:
        return jsonify({
            "message": "Failed to analyze image meta",
            "error": str(e)
        }), 500

if __name__ == "__main__":
    # In containers, disable the Flask reloader and debug mode so the
    # server binds reliably to 0.0.0.0 and doesn't spawn a child process
    # that may bind to loopback. Use a single, unbuffered process here.
    app.run(host="0.0.0.0", port=5004, debug=False, use_reloader=False)