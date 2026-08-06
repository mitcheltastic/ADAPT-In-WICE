---
title: ADAPT-In Policy AI
emoji: 🇮🇩
colorFrom: pink
colorTo: red
sdk: gradio
sdk_version: 4.38.0
app_file: app.py
pinned: false
license: mit
---

# ADAPT-In ML Inference Service

Gradio & FastAPI server hosting the Neural Network model for Indonesia Poverty Priority Classification and Policy Recommendation.

## Endpoints
- Web UI: `https://huggingface.co/spaces/YOUR-USERNAME/YOUR-SPACE-NAME`
- `POST /predict`: Accepts JSON indicator features and returns prediction & policy recommendation.
