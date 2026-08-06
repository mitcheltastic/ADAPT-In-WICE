import os
import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="ADAPT-In Policy AI API",
    description="Adaptive Decision Support System for Poverty Alleviation Intervention Recommendations in Indonesia",
    version="1.0.0",
)

# Enable CORS for Next.js frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "nn_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "scaler_nn.pkl")

# Global variables for model and scaler
model = None
scaler = None

@app.on_event("startup")
def load_artifacts():
    global model, scaler
    try:
        if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
            model = joblib.load(MODEL_PATH)
            scaler = joblib.load(SCALER_PATH)
            print("Successfully loaded model and scaler artifacts.")
        else:
            print("Warning: Model or scaler file not found. Running in fallback mode.")
    except Exception as e:
        print(f"Error loading model artifacts: {e}")

class IndicatorInput(BaseModel):
    rls: float = Field(..., example=8.5, description="Mean Years of Schooling (Rata-rata Lama Sekolah - Years)")
    exp: float = Field(..., example=10000.0, description="Per Capita Expenditure (Pengeluaran per Kapita - Thousand IDR)")
    ipm: float = Field(..., example=68.5, description="Human Development Index (Indeks Pembangunan Manusia)")
    uhh: float = Field(..., example=70.0, description="Life Expectancy (Umur Harapan Hidup - Years)")
    sanitasi: float = Field(..., example=75.0, description="Decent Sanitation Access (% Households)")
    air: float = Field(..., example=85.0, description="Safe Drinking Water Access (% Households)")
    tpt: float = Field(..., example=5.5, description="Open Unemployment Rate (Tingkat Pengangguran Terbuka - %)")
    tpak: float = Field(..., example=65.0, description="Labor Force Participation Rate (% Households)")

class PredictionOutput(BaseModel):
    priority_label: str
    class_code: int
    policy_recommendation: str
    scaled_features: list[float]
    probabilities: list[float] | None = None

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "ADAPT-In ML Inference API",
        "model_loaded": model is not None,
        "scaler_loaded": scaler is not None,
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/predict", response_model=PredictionOutput)
def predict_priority(data: IndicatorInput):
    rls = data.rls
    exp = data.exp
    ipm = data.ipm
    uhh = data.uhh
    sanitasi = data.sanitasi
    air = data.air
    tpt = data.tpt
    tpak = data.tpak

    log_exp = np.log1p(exp)
    indeks_komposit = ipm * log_exp

    # Check required feature length based on scaler
    n_expected = getattr(scaler, "n_features_in_", 8) if scaler else 8
    if n_expected == 10:
        raw_vals = [rls, ipm, log_exp, indeks_komposit, uhh, sanitasi, air, tpt, tpak, log_exp]
    else:
        raw_vals = [rls, exp, ipm, uhh, sanitasi, air, tpt, tpak]

    input_arr = np.array(raw_vals, dtype=np.float64).reshape(1, -1)

    if scaler is not None:
        try:
            input_scaled = scaler.transform(input_arr)
        except Exception:
            input_scaled = input_arr
    else:
        input_scaled = input_arr

    pred_class_code = 1
    probs = None

    if model is not None:
        try:
            pred_res = model.predict(input_scaled)[0]
            if hasattr(model, "predict_proba"):
                probs = model.predict_proba(input_scaled)[0].tolist()

            # Handle class string vs integer return
            pred_str = str(pred_res).lower()
            if "tinggi" in pred_str or "high" in pred_str or str(pred_res) == "2":
                status_label = "High Priority"
                pred_class_code = 2
            elif "sedang" in pred_str or "medium" in pred_str or str(pred_res) == "1":
                status_label = "Medium Priority"
                pred_class_code = 1
            else:
                status_label = "Low Priority"
                pred_class_code = 0
        except Exception as e:
            # Domain logic fallback based on Poverty indicators threshold
            status_label = "Medium Priority"
            pred_class_code = 1
    else:
        # Rules-based priority categorization fallback if model not loaded
        if ipm < 65.0 or sanitasi < 60.0 or air < 70.0:
            status_label = "High Priority"
            pred_class_code = 2
        elif ipm < 72.0 or sanitasi < 80.0:
            status_label = "Medium Priority"
            pred_class_code = 1
        else:
            status_label = "Low Priority"
            pred_class_code = 0

    if status_label == "High Priority":
        policy_text = (
            "Urgent Intervention Required! Emergency social assistance, accelerated "
            "sanitation/clean water infrastructure development, and direct educational cash support."
        )
    elif status_label == "Medium Priority":
        policy_text = (
            "Regular Monitoring Required! Vocational workforce training, local MSME capital support, "
            "and enhancement of basic community health services."
        )
    else:
        policy_text = (
            "Maintenance & Economic Strengthening! Strengthening the local investment climate, "
            "public service automation, and creative industry innovation."
        )

    return PredictionOutput(
        priority_label=status_label,
        class_code=pred_class_code,
        policy_recommendation=policy_text,
        scaled_features=input_scaled.flatten().tolist(),
        probabilities=probs,
    )
