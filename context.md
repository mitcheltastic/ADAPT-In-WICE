# Project Context: ADAPT-In (Poverty Alleviation DSS)

## 📌 Project Overview
**ADAPT-In** (*Adaptive Decision Support System for Poverty Alleviation Intervention Recommendations in Indonesia*) is an AI-driven analytics platform designed to analyze socio-economic indicators across Indonesian regencies/cities (Kabupaten/Kota) and provide data-driven policy recommendations for poverty reduction.

This project was originally built as a single-file **Streamlit** dashboard. The goal now is to fork/refactor this project into a production-grade, modern web application stack:
- **Frontend**: Next.js (TypeScript + Tailwind CSS + GeoJSON Map) deployed on **Vercel**.
- **Backend / AI Model API**: FastAPI server hosting the trained Neural Network model deployed on **Hugging Face Spaces**.

---

## 📁 Source Repository Structure (Legacy Streamlit Setup)

```text
ADAPT-In-WICE/
├── apppeta.py                               # Monolithic Streamlit application
├── nn_model.pkl                             # Trained Neural Network Classifier (joblib)
├── scaler_nn.pkl                            # Feature Scaler (joblib)
├── Klasifikasi Tingkat Kemiskinan di Indonesia.csv  # BPS Socio-economic indicator dataset
├── lat_long_kota_kab.csv                    # Geographic coordinates lookup
├── requirements.txt                         # Legacy Python dependencies
└── context.md                               # Project context reference file
```

---

## 📊 Domain Logic & Dataset Breakdown

### 1. Key Socio-Economic Indicators (Input Features)
* **RLS**: Mean Years of Schooling (*Rata-rata Lama Sekolah* - Years)
* **EXP**: Per Capita Expenditure (*Pengeluaran per Kapita* - Thousand IDR)
* **IPM**: Human Development Index (*Indeks Pembangunan Manusia* - HDI)
* **UHH**: Life Expectancy (*Umur Harapan Hidup* - Years)
* **Sanitasi**: Access to Decent Sanitation (% Households)
* **Air**: Access to Safe Drinking Water (% Households)
* **TPT**: Open Unemployment Rate (*Tingkat Pengangguran Terbuka* - %)
* **TPAK**: Labor Force Participation Rate (*Tingkat Partisipasi Angkatan Kerja* - %)
* **PDRB**: Gross Regional Domestic Product (*Produk Domestik Regional Bruto*)
* **Composite Index**: Derived feature calculated as `IPM * ln(1 + EXP)` (used if model expects 10 features).

### 2. Priority Classification Logic
* **High Priority** ($P_0 > 14.0\%$): Requires urgent social assistance & emergency infrastructure intervention.
* **Medium Priority** ($8.0\% \le P_0 \le 14.0\%$): Vocational training, local MSME support, basic health enhancement.
* **Low Priority** ($P_0 < 8.0\%$): Strengthening investment climate & public service automation.

---

## 🎯 Target Architecture & Tech Stack

### 1. Machine Learning Server (Hugging Face Spaces)
* **Framework**: FastAPI (Python 3.10+)
* **Artifacts**: Load `nn_model.pkl` and `scaler_nn.pkl` via `joblib`.
* **Endpoints**:
  * `POST /predict`: Accepts raw feature JSON, scales input, runs inference, and returns predicted category (`High Priority`, `Medium Priority`, `Low Priority`) along with tailored policy recommendations.

### 2. Dashboard Frontend (Vercel)
* **Framework**: Next.js (App Router, TypeScript)
* **Styling**: Tailwind CSS / Custom CSS + UI Components
* **Mapping**: `react-leaflet` or `react-map-gl` (MapLibre/Mapbox) rendering **Indonesia GeoJSON** boundaries (Choropleth map colored by Poverty rate / Priority level).
* **Charts**: `recharts` for bar charts (Education, Economy, Health, Infrastructure, Employment).

---

## 🗺️ Roadmap & Next Steps for the New Repository

1. **Phase 1: Deploy ML API to Hugging Face**
   - Create FastAPI app (`main.py`) wrapping `nn_model.pkl` & `scaler_nn.pkl`.
   - Test `/predict` endpoint locally and deploy to Hugging Face Spaces.

2. **Phase 2: GeoJSON Data Acquisition**
   - Source/clean Indonesia GeoJSON boundary files (Kabupaten/Kota level or Province level).
   - Join socio-economic attributes from `Klasifikasi Tingkat Kemiskinan di Indonesia.csv` with GeoJSON feature properties.

3. **Phase 3: Next.js Frontend Development**
   - Initialize Next.js app with Tailwind CSS.
   - Build **Tab 1: Descriptive Analytics & GeoJSON Map** (Interactive polygon hover/click, filter by Province, Recharts analytics).
   - Build **Tab 2: AI Simulation Tool** (Interactive slider/number inputs connecting to HF Spaces API endpoint).

4. **Phase 4: Production Deployment**
   - Host frontend on Vercel.
   - Connect domain & environment variables (`NEXT_PUBLIC_HF_API_URL`).
