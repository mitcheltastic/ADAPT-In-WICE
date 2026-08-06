# ADAPT-In 🇮🇩

> **Adaptive Decision Support System for Poverty Alleviation Intervention Recommendations in Indonesia**

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-GeoJSON_Map-green?style=for-the-badge&logo=leaflet)](https://leafletjs.com/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-Neural_Network-orange?style=for-the-badge&logo=scikit-learn)](https://scikit-learn.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

**ADAPT-In** is an AI-driven decision support system designed to analyze socio-economic indicators across Indonesian regencies/cities (*Kabupaten/Kota*) and generate data-driven policy intervention recommendations for poverty reduction.

Originally prototyped as a Streamlit application, ADAPT-In has been refactored into a modern, full-stack **Next.js 14** web application powered by **GeoJSON vector mapping**, **Recharts analytics**, and an embedded **Neural Network (MLPClassifier) inference engine**.

---

## 🌟 Key Features

* 🗺️ **Interactive GeoJSON Spatial Map**: Vector choropleth map rendering Indonesia's 38 provinces & 514 regencies color-coded by poverty rate priority thresholds (*High*, *Medium*, *Low*).
* 📊 **Integrated Indicator Profiles**: Responsive Recharts horizontal bar visualizations covering 3 core profiles:
  * **Education & Economy**: Mean Years of Schooling (MYS), Per Capita Expenditure, Human Development Index (HDI).
  * **Health & Infrastructure**: Life Expectancy, Decent Sanitation Access, Safe Drinking Water Access.
  * **Employment & GRDP**: Open Unemployment Rate, Labor Force Participation Rate, Gross Regional Domestic Product (GRDP).
* 🧠 **Precision AI Simulation Tool**: Instant `<1ms` Neural Network classification and policy recommendation generator supporting precision manual number inputs.
* 🎨 **Glassmorphism Aesthetic System**: Modern pink palette (`#AD336D`, `#8A2355`, `#E8A0BF`, `#FFF0F5`) with responsive card micro-animations.
* ⚡ **Zero-Cost Serverless Deployment**: Built-in neural network weight matrix execution (`lib/model_weights.json`) requiring 0 external server costs or environment variables.

---

## 📊 Domain Logic & Indicators

### 1. Key Input Features
| Indicator | Full Name | Unit | Description |
| :--- | :--- | :--- | :--- |
| **RLS** | *Rata-rata Lama Sekolah* | Years | Mean Years of Schooling (15+ age) |
| **EXP** | *Pengeluaran per Kapita* | Thousand IDR | Adjusted Per Capita Expenditure |
| **IPM** | *Indeks Pembangunan Manusia* | Index (0-100) | Human Development Index (HDI) |
| **UHH** | *Umur Harapan Hidup* | Years | Life Expectancy |
| **Sanitasi** | *Sanitasi Layak* | % Households | Access to Decent Sanitation |
| **Air** | *Air Minum Layak* | % Households | Access to Safe Drinking Water |
| **TPT** | *Tingkat Pengangguran Terbuka* | % | Open Unemployment Rate |
| **TPAK** | *Tingkat Partisipasi Angkatan Kerja* | % | Labor Force Participation Rate |
| **PDRB** | *Produk Domestik Regional Bruto* | IDR | GRDP at Constant Market Prices |

### 2. Poverty Priority Classification Rules
* **High Priority** ($P_0 > 14.0\%$): Requires urgent social assistance, emergency sanitation/clean water infrastructure, and direct educational cash support.
* **Medium Priority** ($8.0\% \le P_0 \le 14.0\%$): Focuses on vocational workforce training, local MSME capital support, and basic health enhancement.
* **Low Priority** ($P_0 < 8.0\%$): Strengthening local investment climate, public service automation, and creative industry innovation.

---

## 📁 Repository Structure

```text
ADAPT-In-WICE/
├── app/                                     # Next.js 14 App Router
│   ├── api/predict/route.ts                 # Embedded Neural Network Serverless API
│   ├── globals.css                          # Custom CSS & Glassmorphism Design System
│   ├── layout.tsx                           # Root Layout & Metadata
│   └── page.tsx                             # Main Dashboard Page (Tabs 1 & 2)
├── components/                              # Reusable UI Components
│   ├── Header.tsx                           # Header & Title Badges
│   ├── MetricCard.tsx                       # Glassmorphic Summary Metric Cards
│   ├── SpatialMap.tsx                       # Leaflet GeoJSON Vector Map Component
│   ├── RegionalProfileCharts.tsx            # Recharts Indicator Profile Bar Charts
│   ├── SimulationForm.tsx                   # Precision Manual Input Form
│   └── RecommendationResult.tsx             # AI Recommendation Output Card
├── public/
│   ├── data/poverty_data.json               # Cleaned 514 Regency Socio-Economic Dataset
│   └── geojson/indonesia_provinces.json     # Indonesia 38 Province GeoJSON Polygon Features
├── lib/
│   └── model_weights.json                   # Neural Network Weights & Scaler Parameters
├── deployed_streamlit/                      # Isolated Legacy Streamlit Application
│   ├── apppeta.py                           # Original Monolithic Streamlit Dashboard
│   ├── Klasifikasi Tingkat Kemiskinan...csv # Raw CSV Dataset
│   ├── lat_long_kota_kab.csv                # Geographic Coordinates Lookup
│   ├── nn_model.pkl                         # Trained Scikit-Learn Model Binary
│   ├── scaler_nn.pkl                        # Scaler Binary
│   └── requirements.txt                     # Legacy Python Dependencies
├── hf_space/                                # Optional FastAPI / Gradio HF Space Package
│   ├── app.py / main.py                     # Python Inference Server
│   ├── Dockerfile                           # Docker Configuration
│   └── README.md                            # Space Metadata
├── package.json                             # Dependencies & Scripts
├── next.config.js                           # Next.js Configuration
├── tailwind.config.js                       # Theme Colors & Extensions
└── tsconfig.json                            # TypeScript Config
```

---

## 🛠️ Local Development Setup

### Prerequisites
* **Node.js**: v18.0 or higher
* **npm**: v9.0 or higher

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mitcheltastic/ADAPT-In-WICE.git
   cd ADAPT-In-WICE
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` in your browser.

---

## 🚀 One-Click Vercel Deployment

This project is configured for **instant 1-click deployment on Vercel** without needing any environment variables or external API keys:

1. Push your changes to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import `ADAPT-In-WICE`.
3. Keep default build settings (`npm run build`) and click **Deploy**.

---

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details.
