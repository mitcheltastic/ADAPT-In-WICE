import os
import joblib
import numpy as np
import gradio as gr
from fastapi import FastAPI
from pydantic import BaseModel, Field

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "nn_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "scaler_nn.pkl")

# Load trained ML model and scaler
model = None
scaler = None

try:
    if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
        print("Model and scaler successfully loaded.")
    else:
        print("Warning: Model or scaler file not found.")
except Exception as e:
    print(f"Error loading model artifacts: {e}")

def predict_policy(rls, exp, ipm, uhh, sanitasi, air, tpt, tpak):
    log_exp = np.log1p(exp)
    indeks_komposit = ipm * log_exp

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

    status_label = "Medium Priority"
    if model is not None:
        try:
            pred_res = model.predict(input_scaled)[0]
            pred_str = str(pred_res).lower()
            if "tinggi" in pred_str or "high" in pred_str or str(pred_res) == "2":
                status_label = "High Priority"
            elif "sedang" in pred_str or "medium" in pred_str or str(pred_res) == "1":
                status_label = "Medium Priority"
            else:
                status_label = "Low Priority"
        except Exception:
            status_label = "Medium Priority"
    else:
        if ipm < 66.0 or sanitasi < 65.0 or air < 75.0 or rls < 7.5:
            status_label = "High Priority"
        elif ipm < 73.0 or sanitasi < 82.0:
            status_label = "Medium Priority"
        else:
            status_label = "Low Priority"

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

    return f"Classification: {status_label}\n\nAI Recommendation: {policy_text}"

# Create Gradio UI + Automatic REST API Endpoint
demo = gr.Interface(
    fn=predict_policy,
    inputs=[
        gr.Number(label="Mean Years of Schooling (MYS - Years)", value=8.5),
        gr.Number(label="Per Capita Expenditure (Thousand IDR)", value=10000.0),
        gr.Number(label="Human Development Index (HDI)", value=68.5),
        gr.Number(label="Life Expectancy (Years)", value=70.0),
        gr.Number(label="Decent Sanitation Access (%)", value=75.0),
        gr.Number(label="Safe Drinking Water Access (%)", value=85.0),
        gr.Number(label="Open Unemployment Rate (%)", value=5.5),
        gr.Number(label="Labor Force Participation Rate (%)", value=65.0),
    ],
    outputs=gr.Textbox(label="ADAPT-In AI Policy Recommendation"),
    title="ADAPT-In Policy AI Model Server",
    description="Adaptive Decision Support System for Poverty Alleviation Intervention Recommendations in Indonesia",
)

# Custom FastAPI backend route to support direct POST /predict endpoint
app = FastAPI()

class IndicatorInput(BaseModel):
    rls: float = Field(..., example=8.5)
    exp: float = Field(..., example=10000.0)
    ipm: float = Field(..., example=68.5)
    uhh: float = Field(..., example=70.0)
    sanitasi: float = Field(..., example=75.0)
    air: float = Field(..., example=85.0)
    tpt: float = Field(..., example=5.5)
    tpak: float = Field(..., example=65.0)

@app.post("/predict")
def api_predict(data: IndicatorInput):
    result_text = predict_policy(
        data.rls, data.exp, data.ipm, data.uhh, data.sanitasi, data.air, data.tpt, data.tpak
    )
    lines = result_text.split("\n\n")
    priority_label = lines[0].replace("Classification: ", "").strip()
    policy_recommendation = lines[1].replace("AI Recommendation: ", "").strip()
    return {
        "priority_label": priority_label,
        "policy_recommendation": policy_recommendation,
    }

# Mount custom FastAPI routes onto Gradio
app = gr.mount_gradio_app(app, demo, path="/")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
