import sys
import json
from pathlib import Path
import joblib
import pandas as pd

# load model
MODEL_PATH = Path(__file__).resolve().parent / "model.pkl"
model = joblib.load(MODEL_PATH)

# read JSON from stdin
input_json = sys.stdin.read()

data = json.loads(input_json)

df = pd.DataFrame([data])

prediction = model.predict(df)

result = {
    "estimated_price": int(prediction[0])
}

print(json.dumps(result).strip(), flush=True)