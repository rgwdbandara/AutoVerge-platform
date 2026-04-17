import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import joblib

# ---------------------------
# LOAD DATA
# ---------------------------
df = pd.read_csv("dataset.csv")

# ---------------------------
# CLEAN DATA
# ---------------------------
df["price"] = df["price"].replace(r'[\$,]', '', regex=True).astype(float)
df["milage"] = df["milage"].str.replace("[^0-9]", "", regex=True).astype(float)

df.rename(columns={
    "model_year": "year",
    "milage": "mileage"
}, inplace=True)

df["fuel_type"] = df["fuel_type"].fillna("Unknown")

df = df[[
    "brand",
    "model",
    "year",
    "mileage",
    "fuel_type",
    "transmission",
    "price"
]]

# ---------------------------
# FEATURES & TARGET
# ---------------------------
X = df.drop("price", axis=1)
y = df["price"]

# ---------------------------
# CATEGORICAL COLUMNS
# ---------------------------
categorical_cols = ["brand", "model", "fuel_type", "transmission"]
numerical_cols = ["year", "mileage"]

# ---------------------------
# PREPROCESSING
# ---------------------------
preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown='ignore'), categorical_cols),
        ("num", "passthrough", numerical_cols)
    ]
)

# ---------------------------
# MODEL
# ---------------------------
model = RandomForestRegressor(n_estimators=100, random_state=42)

# ---------------------------
# PIPELINE
# ---------------------------
pipeline = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("model", model)
])

# ---------------------------
# SPLIT DATA
# ---------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ---------------------------
# TRAIN MODEL
# ---------------------------
pipeline.fit(X_train, y_train)

# ---------------------------
# SAVE MODEL
# ---------------------------
joblib.dump(pipeline, "model.pkl")

print("✅ Model trained and saved as model.pkl")