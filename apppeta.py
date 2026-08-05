import os
import re
import joblib
import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st

# ==========================================
# 1. CONFIG & ADVANCED PINK AESTHETIC STYLING
# ==========================================
st.set_page_config(
    page_title=(
        "ADAPT-IN: Adaptive Decision Support System for Poverty Alleviation"
        " Intervention Recommendations in Indonesia"
    ),
    layout="wide",
    initial_sidebar_state="expanded",
)

st.markdown(
    """
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', sans-serif;
    }

    .stApp {
        background: linear-gradient(180deg, #FFF9FA 0%, #FFF0F5 100%);
    }

    section[data-testid="stSidebar"] {
        background-color: #FFFFFF;
        border-right: 1px solid #FAD02C33;
        box-shadow: 4px 0px 20px rgba(232, 160, 191, 0.1);
    }
    
    h1 {
        color: #AD336D !important;
        font-weight: 800 !important;
        letter-spacing: -0.5px;
    }
    
    h2, h3, h4 {
        color: #8A2355 !important;
        font-weight: 700 !important;
    }

    .metric-card-pink {
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 22px 16px;
        box-shadow: 0 10px 25px rgba(232, 160, 191, 0.15);
        text-align: center;
        border: 1px solid rgba(232, 160, 191, 0.3);
        border-top: 6px solid #E8A0BF;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .metric-card-pink:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(232, 160, 191, 0.25);
    }

    .metric-card-pink h4 {
        color: #8A2355;
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.8px;
        text-transform: uppercase;
        margin-bottom: 8px;
    }

    .metric-card-pink h2 {
        color: #AD336D;
        font-size: 36px;
        margin: 0;
        font-weight: 800;
    }

    .profile-card-pink {
        background: rgba(255, 255, 255, 0.9);
        border-radius: 18px;
        padding: 16px 20px;
        margin-bottom: 20px;
        border: 1px solid #F8C8DC;
        box-shadow: 0 8px 20px rgba(232, 160, 191, 0.12);
    }

    .profile-card-title {
        color: #8A2355;
        font-size: 16px;
        font-weight: 800;
        margin-bottom: 12px;
        border-bottom: 2px solid #F8C8DC;
        padding-bottom: 6px;
    }

    .recommendation-card-pink {
        border-radius: 20px;
        padding: 28px;
        margin-top: 20px;
        box-shadow: 0 10px 30px rgba(212, 122, 232, 0.18);
        border: 2px solid #F8C8DC;
        backdrop-filter: blur(8px);
    }

    .stTabs [data-baseweb="tab-list"] {
        gap: 12px;
        background-color: rgba(255, 240, 245, 0.8);
        padding: 8px;
        border-radius: 16px;
        border: 1px solid #F8C8DC;
    }

    .stTabs [data-baseweb="tab"] {
        height: 48px;
        border-radius: 12px;
        color: #AD336D;
        font-weight: 700;
        padding: 0px 20px;
    }

    .stTabs [aria-selected="true"] {
        background: linear-gradient(135deg, #E8A0BF 0%, #AD336D 100%) !important;
        color: #FFFFFF !important;
        box-shadow: 0 4px 12px rgba(173, 51, 109, 0.3);
    }

    .stNumberInput input {
        border-radius: 12px !important;
        border: 1px solid #F8C8DC !important;
    }

    .stButton>button {
        background: linear-gradient(135deg, #E8A0BF 0%, #AD336D 100%);
        color: white;
        border-radius: 30px;
        border: none;
        padding: 14px 28px;
        font-size: 16px;
        font-weight: 700;
        box-shadow: 0 6px 18px rgba(173, 51, 109, 0.35);
        transition: all 0.3s ease;
    }

    .stButton>button:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 22px rgba(173, 51, 109, 0.5);
    }
    </style>
""",
    unsafe_allow_html=True,
)

BASE_DIR = r"D:\LOMBA WICE 2026 ADAPT-In"

# ==========================================
# 2. LOAD MODEL ARTIFACTS & DATASET
# ==========================================
@st.cache_resource
def load_artifacts():
    try:
        model_path = os.path.join(BASE_DIR, "nn_model.pkl")
        scaler_path = os.path.join(BASE_DIR, "scaler_nn.pkl")
        model = joblib.load(model_path if os.path.exists(model_path) else "nn_model.pkl")
        scaler = joblib.load(scaler_path if os.path.exists(scaler_path) else "scaler_nn.pkl")
        return model, scaler
    except Exception:
        return None, None


@st.cache_data
def load_data():
    file_kemiskinan = os.path.join(BASE_DIR, "Klasifikasi Tingkat Kemiskinan di Indonesia.csv")
    file_latlong = os.path.join(BASE_DIR, "lat_long_kota_kab.csv")

    try:
        df_kemiskinan = pd.read_csv(file_kemiskinan, sep=";")
    except Exception:
        try:
            df_kemiskinan = pd.read_csv("Klasifikasi Tingkat Kemiskinan di Indonesia.csv", sep=";")
        except Exception:
            df_kemiskinan = pd.read_csv("Klasifikasi Tingkat Kemiskinan.csv", sep=None, engine="python")

    try:
        df_latlong = pd.read_csv(file_latlong, sep=None, engine="python")
    except Exception:
        df_latlong = pd.read_csv("lat_long_kota_kab.csv", sep=None, engine="python")

    df_kemiskinan.columns = df_kemiskinan.columns.astype(str).str.strip()
    df_latlong.columns = df_latlong.columns.astype(str).str.strip()

    # Precise Merge Key Cleaning Logic
    def clean_key(text):
        text = str(text).upper()
        text = re.sub(r'[^A-Z0-9]', '', text)
        for prefix in ['KABUPATEN', 'KOTA', 'ADM']:
            if text.startswith(prefix):
                text = text[len(prefix):]
        return text

    kab_col_raw = [c for c in df_kemiskinan.columns if "kab" in c.lower() or "kota" in c.lower()]
    kab_col_name = kab_col_raw[0] if kab_col_raw else df_kemiskinan.columns[0]

    df_kemiskinan["clean_key"] = df_kemiskinan[kab_col_name].apply(clean_key)
    
    geo_name_col = "name" if "name" in df_latlong.columns else df_latlong.columns[0]
    df_latlong["clean_key"] = df_latlong[geo_name_col].apply(clean_key)

    df = pd.merge(
        df_kemiskinan,
        df_latlong[["clean_key", "lat", "long"]],
        on="clean_key",
        how="left"
    )

    p0_col = "Persentase Penduduk Miskin (P0) Menurut Kabupaten/Kota (Persen)"
    if p0_col not in df.columns:
        p0_col = [c for c in df.columns if "miskin" in c.lower() or "p0" in c.lower()][0]

    keyword_map = {
        "rls": ["lama sekolah"],
        "exp": ["pengeluaran per kapita"],
        "ipm": ["pembangunan manusia"],
        "uhh": ["harapan hidup"],
        "sanitasi": ["sanitasi"],
        "air": ["air minum"],
        "tpt": ["pengangguran"],
        "tpak": ["partisipasi angkatan kerja"],
        "pdrb": ["pdrb"],
    }

    feature_dict = {}
    features = []
    for key, keywords in keyword_map.items():
        matched = None
        for col in df.columns:
            if all(kw.lower() in col.lower() for kw in keywords):
                matched = col
                break
        if matched:
            feature_dict[key] = matched
            if matched not in features:
                features.append(matched)

    def safe_clean_num(val):
        if pd.isna(val):
            return np.nan
        s = str(val).strip()
        if "," in s and "." in s:
            s = s.replace(".", "").replace(",", ".")
        elif "," in s:
            s = s.replace(",", ".")
        try:
            return float(s)
        except ValueError:
            return np.nan

    for col in features + [p0_col]:
        if col in df.columns:
            df[col] = df[col].apply(safe_clean_num)

    df = df.dropna(subset=[p0_col]).reset_index(drop=True)

    def categorize_priority(p0):
        if pd.notna(p0):
            if p0 < 8.0:
                return "Low Priority"
            elif p0 <= 14.0:
                return "Medium Priority"
            else:
                return "High Priority"
        return "Medium Priority"

    df["Prioritas_Target"] = df[p0_col].apply(categorize_priority)

    return df, features, p0_col, feature_dict


model, scaler = load_artifacts()
df, features, p0_col, feature_dict = load_data()

# ==========================================
# 3. SIDEBAR CONTROLS
# ==========================================
st.sidebar.markdown(
    "<h2 style='color: #AD336D;'>Navigation & Filter</h2>",
    unsafe_allow_html=True,
)

prov_col = [c for c in df.columns if "provinsi" in c.lower()]
prov_name = prov_col[0] if prov_col else "Provinsi"

prov_list = (
    ["All Provinces"] + sorted(list(df[prov_name].unique()))
    if prov_name in df.columns
    else ["All Provinces"]
)
selected_prov = st.sidebar.selectbox("Select Province Region:", prov_list)

filtered_df = df.copy()
if selected_prov != "All Provinces" and prov_name in df.columns:
    filtered_df = filtered_df[filtered_df[prov_name] == selected_prov]

st.sidebar.markdown("---")
st.sidebar.markdown(
    """
    <div style="background-color: #FFF0F5; padding: 15px; border-radius: 12px; border: 1px solid #F8C8DC;">
        <h5 style="color: #8A2355; margin: 0 0 6px 0;">DSS Guidelines</h5>
        <p style="color: #666; font-size: 12px; margin: 0;">Use <b>Tab 1</b> for regional descriptive analysis, and <b>Tab 2</b> to simulate data-driven AI policy recommendations.</p>
    </div>
""",
    unsafe_allow_html=True,
)

# Main Header
st.title(
    "ADAPT-IN: Adaptive Decision Support System for Poverty Alleviation"
    " Intervention Recommendations in Indonesia"
)
st.markdown(
    "<p style='color: #8A2355; font-size: 16px; font-weight: 600;'>AI-Based Analytics Platform & Decision Support System (DSS) for Poverty Alleviation in Indonesia</p>",
    unsafe_allow_html=True,
)
st.markdown("---")

# ==========================================
# 4. DASHBOARD TABS (1 & 2)
# ==========================================
tab1, tab2 = st.tabs([
    "1. Regional Descriptive Analysis",
    "2. Simulation Tool (AI Prediction)",
])

# ------------------------------------------
# TAB 1: REGIONAL DESCRIPTIVE ANALYSIS
# ------------------------------------------
with tab1:
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.markdown(
            f"""<div class='metric-card-pink'>
            <h4>TOTAL REGIONS</h4>
            <h2>{len(filtered_df)}</h2>
        </div>""",
            unsafe_allow_html=True,
        )
    with col2:
        c_high = len(filtered_df[filtered_df["Prioritas_Target"] == "High Priority"])
        st.markdown(
            f"""<div class='metric-card-pink' style='border-top: 6px solid #D47AE8;'>
            <h4>HIGH PRIORITY</h4>
            <h2 style='color:#AD336D;'>{c_high}</h2>
        </div>""",
            unsafe_allow_html=True,
        )
    with col3:
        c_med = len(filtered_df[filtered_df["Prioritas_Target"] == "Medium Priority"])
        st.markdown(
            f"""<div class='metric-card-pink' style='border-top: 6px solid #FFB6C1;'>
            <h4>MEDIUM PRIORITY</h4>
            <h2 style='color:#E8A0BF;'>{c_med}</h2>
        </div>""",
            unsafe_allow_html=True,
        )
    with col4:
        c_low = len(filtered_df[filtered_df["Prioritas_Target"] == "Low Priority"])
        st.markdown(
            f"""<div class='metric-card-pink' style='border-top: 6px solid #B5EAD7;'>
            <h4>LOW PRIORITY</h4>
            <h2 style='color:#519E8A;'>{c_low}</h2>
        </div>""",
            unsafe_allow_html=True,
        )

    st.markdown("<br>", unsafe_allow_html=True)

    # ==========================================
    # INTERACTIVE PINK SPATIAL MAP OF INDONESIA
    # ==========================================
    st.subheader("Spatial Distribution Map of Poverty Percentage in Indonesia")

    # Aggregate lat/long and P0 data per province
    map_df = (
        filtered_df.dropna(subset=["lat", "long"])
        .groupby(prov_name, as_index=False)
        .agg({"lat": "mean", "long": "mean", p0_col: "mean"})
    )

    if not map_df.empty:
        fig_map = go.Figure()

        # 1. COLOR INDONESIAN LANDMASS WITH DUSTY PINK
        fig_map.add_trace(
            go.Choropleth(
                locations=["Indonesia"],
                locationmode="country names",
                z=[1],
                colorscale=[[0, "#F2E6EA"], [1, "#F2E6EA"]],  # Dusty Pink color for Indonesia
                showscale=False,
                hoverinfo="skip",
                marker_line_color="#4A4A4A",  # Sharp dark gray island borders
                marker_line_width=1.2,
            )
        )

        # 2. LEGEND COLORBAR GRADIENT PINK HORIZONTAL (BOTTOM LEFT)
        fig_map.add_trace(
            go.Scattergeo(
                lon=map_df["long"],
                lat=map_df["lat"],
                mode="markers",
                marker=dict(
                    size=0.1,  # Transparent
                    color=map_df[p0_col],
                    colorscale=[
                        [0.0, "#FCE4EC"],  # Light Pink
                        [0.25, "#F8C8DC"],
                        [0.5, "#E8A0BF"],  # Medium Pink
                        [0.75, "#AD336D"],
                        [1.0, "#8A2355"],  # Dark Magenta
                    ],
                    showscale=True,
                    colorbar=dict(
                        title=dict(
                            text="Poverty (%)",
                            font=dict(size=12, color="#2C3E50", family="Plus Jakarta Sans"),
                            side="top",
                        ),
                        orientation="h",  # Horizontal orientation
                        x=0.02,
                        y=0.05,
                        len=0.25,
                        thickness=12,
                        tickfont=dict(size=10, color="#2C3E50"),
                        outlinewidth=1,
                        outlinecolor="#CCCCCC",
                    ),
                ),
                showlegend=False,
                hoverinfo="skip",
            )
        )

        # 3. TEXT PERCENTAGE VALUES FOR P0 (PURE TEXT WITHOUT MARKERS)
        fig_map.add_trace(
            go.Scattergeo(
                lon=map_df["long"],
                lat=map_df["lat"],
                text=map_df[p0_col].apply(lambda x: f"{x:.1f}"),
                mode="text",  # Pure text
                textfont=dict(
                    size=12,
                    color="#2C3E50",
                    family="Plus Jakarta Sans",
                    weight="bold",
                ),
                hoverinfo="text",
                hovertext=map_df[prov_name] + ": " + map_df[p0_col].round(2).astype(str) + "%",
                showlegend=False,
            )
        )

        # 4. LOCK FOCUS TO INDONESIA, FOREIGN LANDMARKS FLAT GRAY
        fig_map.update_geos(
            visible=False,
            showcountries=True,
            countrycolor="#B0B0B0",    # Thin outer country borders
            countrywidth=0.8,
            showland=True,
            landcolor="#E5E5E5",       # Foreign land in neutral gray
            showocean=True,
            oceancolor="#FFFFFF",      # Clean white ocean
            projection_type="mercator",
            center={"lat": -2.5489, "lon": 118.0149},  # Center on Indonesia
            lataxis_range=[-12, 8],     # Vertical bounds for Indonesia
            lonaxis_range=[94, 142],    # Horizontal bounds for Indonesia
        )

        # 5. ENABLE PAN & ZOOM INTERACTIONS
        fig_map.update_layout(
            margin={"r": 0, "t": 10, "l": 0, "b": 10},
            height=480,
            paper_bgcolor="rgba(0,0,0,0)",
            plot_bgcolor="rgba(0,0,0,0)",
            dragmode="pan",  # Draggable panning
        )

        st.plotly_chart(
            fig_map, 
            use_container_width=True, 
            config={"displayModeBar": True, "scrollZoom": True}  # Enable scroll zoom & nav buttons
        )
    else:
        st.warning("Latitude/Longitude coordinate data not found.")

    st.markdown("---")

    kab_col = [c for c in df.columns if "kab" in c.lower() or "kota" in c.lower()]
    kab_name = kab_col[0] if kab_col else None

    st.subheader(
        "Integrated Regional Indicator Profiles (Education, Economy, Health,"
        " Infrastructure, Employment & GRDP)"
    )

    prof_col1, prof_col2, prof_col3 = st.columns(3)

    rls_col = feature_dict.get("rls", [c for c in features if "sekolah" in c.lower() or "rls" in c.lower()][0])
    exp_col = feature_dict.get("exp", [c for c in features if "pengeluaran" in c.lower() or "kapita" in c.lower()][0])
    ipm_col = feature_dict.get("ipm", [c for c in features if "pembangunan manusia" in c.lower() or "ipm" in c.lower()][0])
    uhh_col = feature_dict.get("uhh", [c for c in features if "harapan hidup" in c.lower() or "uhh" in c.lower()][0])
    sanitasi_col = feature_dict.get("sanitasi", [c for c in features if "sanitasi" in c.lower()][0])
    air_col = feature_dict.get("air", [c for c in features if "air" in c.lower()][0])
    tpt_col = feature_dict.get("tpt", [c for c in features if "pengangguran" in c.lower() or "tpt" in c.lower()][0])
    tpak_col = feature_dict.get("tpak", [c for c in features if "partisipasi" in c.lower() or "tpak" in c.lower()][0])
    pdrb_col = feature_dict.get("pdrb", [c for c in features if "pdrb" in c.lower() or "pengeluaran" in c.lower()][0])

    # COLUMN 1: EDUCATION & ECONOMY
    with prof_col1:
        st.markdown(
            """<div class='profile-card-pink'>
            <div class='profile-card-title'>Education & Economy Profile</div>
        </div>""",
            unsafe_allow_html=True,
        )

        top_rls = filtered_df.sort_values(by=rls_col, ascending=False).head(5)
        fig_rls = px.bar(
            top_rls,
            x=rls_col,
            y=kab_name if kab_name else top_rls.index,
            orientation="h",
            title="Mean Years of Schooling (MYS)",
            labels={rls_col: "Mean Years of Schooling (Years)", kab_name: "Regency/City"},
            color_discrete_sequence=["#E8A0BF"],
            template="plotly_white",
            text_auto=".1f",
        )
        fig_rls.update_layout(
            yaxis={"categoryorder": "total ascending", "title": "Regency/City"},
            xaxis_title="Mean Years of Schooling (Years)",
            paper_bgcolor="rgba(0,0,0,0)",
            plot_bgcolor="rgba(0,0,0,0)",
            height=210,
            margin=dict(l=0, r=0, t=30, b=0),
        )
        st.plotly_chart(fig_rls, use_container_width=True)

        top_exp = filtered_df.sort_values(by=exp_col, ascending=False).head(5)
        fig_exp = px.bar(
            top_exp,
            x=exp_col,
            y=kab_name if kab_name else top_exp.index,
            orientation="h",
            title="Per Capita Expenditure (Thousand IDR)",
            labels={exp_col: "Adjusted Per Capita Expenditure (Thousand IDR)", kab_name: "Regency/City"},
            color_discrete_sequence=["#AD336D"],
            template="plotly_white",
            text_auto=".0f",
        )
        fig_exp.update_layout(
            yaxis={"categoryorder": "total ascending", "title": "Regency/City"},
            xaxis_title="Adjusted Per Capita Expenditure (Thousand IDR)",
            paper_bgcolor="rgba(0,0,0,0)",
            plot_bgcolor="rgba(0,0,0,0)",
            height=210,
            margin=dict(l=0, r=0, t=30, b=0),
        )
        st.plotly_chart(fig_exp, use_container_width=True)

        top_ipm = filtered_df.sort_values(by=ipm_col, ascending=False).head(5)
        fig_ipm = px.bar(
            top_ipm,
            x=ipm_col,
            y=kab_name if kab_name else top_ipm.index,
            orientation="h",
            title="Human Development Index (HDI)",
            labels={ipm_col: "Human Development Index", kab_name: "Regency/City"},
            color_discrete_sequence=["#8A2355"],
            template="plotly_white",
            text_auto=".1f",
        )
        fig_ipm.update_layout(
            yaxis={"categoryorder": "total ascending", "title": "Regency/City"},
            xaxis_title="Human Development Index",
            paper_bgcolor="rgba(0,0,0,0)",
            plot_bgcolor="rgba(0,0,0,0)",
            height=210,
            margin=dict(l=0, r=0, t=30, b=0),
        )
        st.plotly_chart(fig_ipm, use_container_width=True)

    # COLUMN 2: HEALTH & INFRASTRUCTURE
    with prof_col2:
        st.markdown(
            """<div class='profile-card-pink'>
            <div class='profile-card-title'>Health & Infrastructure Profile</div>
        </div>""",
            unsafe_allow_html=True,
        )

        top_uhh = filtered_df.sort_values(by=uhh_col, ascending=False).head(5)
        fig_uhh = px.bar(
            top_uhh,
            x=uhh_col,
            y=kab_name if kab_name else top_uhh.index,
            orientation="h",
            title="Life Expectancy (Years)",
            labels={uhh_col: "Life Expectancy (Years)", kab_name: "Regency/City"},
            color_discrete_sequence=["#FFB6C1"],
            template="plotly_white",
            text_auto=".1f",
        )
        fig_uhh.update_layout(
            yaxis={"categoryorder": "total ascending", "title": "Regency/City"},
            xaxis_title="Life Expectancy (Years)",
            paper_bgcolor="rgba(0,0,0,0)",
            plot_bgcolor="rgba(0,0,0,0)",
            height=210,
            margin=dict(l=0, r=0, t=30, b=0),
        )
        st.plotly_chart(fig_uhh, use_container_width=True)

        top_san = filtered_df.sort_values(by=sanitasi_col, ascending=False).head(5)
        fig_san = px.bar(
            top_san,
            x=sanitasi_col,
            y=kab_name if kab_name else top_san.index,
            orientation="h",
            title="Decent Sanitation Access (%)",
            labels={sanitasi_col: "Percentage of Households with Access to Sanitation (%)", kab_name: "Regency/City"},
            color_discrete_sequence=["#D47AE8"],
            template="plotly_white",
            text_auto=".1f",
        )
        fig_san.update_layout(
            yaxis={"categoryorder": "total ascending", "title": "Regency/City"},
            xaxis_title="Percentage of Households with Access to Sanitation (%)",
            paper_bgcolor="rgba(0,0,0,0)",
            plot_bgcolor="rgba(0,0,0,0)",
            height=210,
            margin=dict(l=0, r=0, t=30, b=0),
        )
        st.plotly_chart(fig_san, use_container_width=True)

        top_air = filtered_df.sort_values(by=air_col, ascending=False).head(5)
        fig_air = px.bar(
            top_air,
            x=air_col,
            y=kab_name if kab_name else top_air.index,
            orientation="h",
            title="Safe Drinking Water Access (%)",
            labels={air_col: "Percentage of Households with Access to Drinking Water (%)", kab_name: "Regency/City"},
            color_discrete_sequence=["#B5EAD7"],
            template="plotly_white",
            text_auto=".1f",
        )
        fig_air.update_layout(
            yaxis={"categoryorder": "total ascending", "title": "Regency/City"},
            xaxis_title="Percentage of Households with Access to Drinking Water (%)",
            paper_bgcolor="rgba(0,0,0,0)",
            plot_bgcolor="rgba(0,0,0,0)",
            height=210,
            margin=dict(l=0, r=0, t=30, b=0),
        )
        st.plotly_chart(fig_air, use_container_width=True)

    # COLUMN 3: EMPLOYMENT & GRDP
    with prof_col3:
        st.markdown(
            """<div class='profile-card-pink'>
            <div class='profile-card-title'>Employment & GRDP Profile</div>
        </div>""",
            unsafe_allow_html=True,
        )

        top_tpt = filtered_df.sort_values(by=tpt_col, ascending=True).head(5)
        fig_tpt = px.bar(
            top_tpt,
            x=tpt_col,
            y=kab_name if kab_name else top_tpt.index,
            orientation="h",
            title="Lowest Open Unemployment Rate (%)",
            labels={tpt_col: "Open Unemployment Rate (%)", kab_name: "Regency/City"},
            color_discrete_sequence=["#F8C8DC"],
            template="plotly_white",
            text_auto=".1f",
        )
        fig_tpt.update_layout(
            yaxis={"categoryorder": "total descending", "title": "Regency/City"},
            xaxis_title="Open Unemployment Rate (%)",
            paper_bgcolor="rgba(0,0,0,0)",
            plot_bgcolor="rgba(0,0,0,0)",
            height=210,
            margin=dict(l=0, r=0, t=30, b=0),
        )
        st.plotly_chart(fig_tpt, use_container_width=True)

        top_tpak = filtered_df.sort_values(by=tpak_col, ascending=False).head(5)
        fig_tpak = px.bar(
            top_tpak,
            x=tpak_col,
            y=kab_name if kab_name else top_tpak.index,
            orientation="h",
            title="Labor Force Participation Rate (%)",
            labels={tpak_col: "Labor Force Participation Rate (%)", kab_name: "Regency/City"},
            color_discrete_sequence=["#E8A0BF"],
            template="plotly_white",
            text_auto=".1f",
        )
        fig_tpak.update_layout(
            yaxis={"categoryorder": "total ascending", "title": "Regency/City"},
            xaxis_title="Labor Force Participation Rate (%)",
            paper_bgcolor="rgba(0,0,0,0)",
            plot_bgcolor="rgba(0,0,0,0)",
            height=210,
            margin=dict(l=0, r=0, t=30, b=0),
        )
        st.plotly_chart(fig_tpak, use_container_width=True)

        top_pdrb = filtered_df.sort_values(by=pdrb_col, ascending=False).head(5)
        fig_pdrb = px.bar(
            top_pdrb,
            x=pdrb_col,
            y=kab_name if kab_name else top_pdrb.index,
            orientation="h",
            title="Per Capita Expenditure / GRDP",
            labels={pdrb_col: "GRDP at Constant Market Prices", kab_name: "Regency/City"},
            color_discrete_sequence=["#AD336D"],
            template="plotly_white",
            text_auto=".2s",
        )
        fig_pdrb.update_layout(
            yaxis={"categoryorder": "total ascending", "title": "Regency/City"},
            xaxis_title="GRDP at Constant Market Prices",
            paper_bgcolor="rgba(0,0,0,0)",
            plot_bgcolor="rgba(0,0,0,0)",
            height=210,
            margin=dict(l=0, r=0, t=30, b=0),
        )
        st.plotly_chart(fig_pdrb, use_container_width=True)


# ------------------------------------------
# TAB 2: SIMULATION TOOL (AI PREDICTION)
# ------------------------------------------
with tab2:
    st.subheader("Interactive Simulation Tool (Precision Input)")
    st.write(
        "Enter the socio-economic indicator values for a region below:"
    )

    col_s1, col_s2, col_s3 = st.columns(3)

    with col_s1:
        st.markdown("##### Education & Economy")
        rls = st.number_input(
            "Mean Years of Schooling (Years)",
            min_value=0.0,
            max_value=15.0,
            value=8.5,
            step=0.1,
            format="%.1f",
        )
        exp = st.number_input(
            "Per Capita Expenditure (Thousand IDR)",
            min_value=1000,
            max_value=30000,
            value=10000,
            step=500,
        )
        ipm = st.number_input(
            "Human Development Index (HDI)",
            min_value=40.0,
            max_value=90.0,
            value=68.5,
            step=0.5,
            format="%.1f",
        )

    with col_s2:
        st.markdown("##### Health & Infrastructure")
        uhh = st.number_input(
            "Life Expectancy (Years)",
            min_value=50.0,
            max_value=80.0,
            value=70.0,
            step=0.5,
            format="%.1f",
        )
        sanitasi = st.number_input(
            "Decent Sanitation Access (%)",
            min_value=0.0,
            max_value=100.0,
            value=75.0,
            step=1.0,
            format="%.1f",
        )
        air_minum = st.number_input(
            "Safe Drinking Water Access (%)",
            min_value=0.0,
            max_value=100.0,
            value=85.0,
            step=1.0,
            format="%.1f",
        )

    with col_s3:
        st.markdown("##### Employment & GRDP")
        tpt = st.number_input(
            "Open Unemployment Rate (%)",
            min_value=0.0,
            max_value=25.0,
            value=5.5,
            step=0.1,
            format="%.1f",
        )
        tpak = st.number_input(
            "Labor Force Participation Rate (%)",
            min_value=0.0,
            max_value=100.0,
            value=65.0,
            step=1.0,
            format="%.1f",
        )

    st.markdown("<br>", unsafe_allow_html=True)
    btn_predict = st.button(
        "Run AI Analysis & Get Policy Recommendations", use_container_width=True
    )

    if btn_predict and model is not None and scaler is not None:
        log_exp = np.log1p(exp)
        indeks_komposit = ipm * log_exp

        slider_vals = [
            rls,
            ipm,
            log_exp,
            indeks_komposit,
            uhh,
            sanitasi,
            air_minum,
            tpt,
            tpak,
        ]

        input_array = np.array(slider_vals).reshape(1, -1)

        input_scaled = scaler.transform(input_array)
        pred_class = model.predict(input_scaled)[0]

        pred_str = str(pred_class).lower()

        if "tinggi" in pred_str or "high" in pred_str:
            status_label = "High Priority"
            bg_color = "rgba(255, 240, 245, 0.95)"
            border_color = "#D47AE8"
            policy_text = (
                "Urgent Intervention Required! Emergency social assistance, accelerated"
                " sanitation/clean water infrastructure, and direct educational support."
            )
        elif "sedang" in pred_str or "medium" in pred_str:
            status_label = "Medium Priority"
            bg_color = "rgba(255, 245, 238, 0.95)"
            border_color = "#FFB6C1"
            policy_text = (
                "Regular Monitoring Required! Vocational workforce training, local MSME capital support,"
                " and enhancement of basic health services."
            )
        else:
            status_label = "Low Priority"
            bg_color = "rgba(240, 255, 240, 0.95)"
            border_color = "#B5EAD7"
            policy_text = (
                "Maintenance & Economic Strengthening! Strengthening the investment climate,"
                " public service automation, and creative industry innovation."
            )

        st.markdown("---")
        st.subheader("ADAPT-In Policy Recommendation Results:")

        st.markdown(
            f"""
            <div class="recommendation-card-pink" style="background-color: {bg_color}; border-left: 8px solid {border_color};">
                <h2 style="margin:0; color:#8A2355;">Classification: <b>{status_label}</b></h2>
                <p style="font-size:16px; margin-top:12px; color:#34495E;"><b>AI Policy Recommendation:</b> {policy_text}</p>
            </div>
            """,
            unsafe_allow_html=True,
        )
