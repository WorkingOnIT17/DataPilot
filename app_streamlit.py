import streamlit as st
import os
import pandas as pd
import numpy as np
import tempfile

from src import cleaning, validation, anomalies, visualize, reporting, io_utils, predictive
from src.main import load_config
from src.query_engine import DataPilotQueryEngine

st.set_page_config(page_title="DataPilot - Data Analyst", page_icon="")
st.title("DataPilot – Ingestion, Preprocessing & Visualization Pipeline")
st.write("Upload a **CSV** or **Excel** file to clean, validate, detect anomalies, analyze business metrics, and generate interactive visualizations.")

# ---------------- Sidebar Controls ----------------
st.sidebar.header("Settings & Pipeline")

enable_insights = st.sidebar.checkbox("Enable Predictive Insights & ML", value=True)
report_type = st.sidebar.radio("Report Type", ["HTML", "PDF", "Both"], index=0)
num_clusters = st.sidebar.slider("Number of Clusters (KMeans)", min_value=2, max_value=6, value=3)

# Data source choice
st.sidebar.markdown("---")
st.sidebar.subheader("Data Source")
input_choice = st.sidebar.radio("Input Method", ["Upload File (CSV / Excel)", "Use Sample Dataset"], index=0)

auto_detect_headers = st.sidebar.checkbox("Smart Header Auto-Detection", value=True, help="Automatically strips title banners, empty leading rows/columns, and detects true table headers.")

uploaded_file = None
sample_file_path = None

if input_choice == "Upload File (CSV / Excel)":
    uploaded_file = st.sidebar.file_uploader("Upload CSV or Excel file", type=["csv", "xlsx", "xls"])
else:
    # Discover samples in sample_data/
    sample_files = [f for f in os.listdir("sample_data") if f.endswith((".csv", ".xlsx", ".xls")) and not f.startswith("create")]
    if sample_files:
        chosen_sample = st.sidebar.selectbox("Choose sample file", sample_files)
        sample_file_path = os.path.join("sample_data", chosen_sample)
    else:
        st.sidebar.warning("No sample files found in sample_data/")

# Main Pipeline Execution
if uploaded_file or sample_file_path:
    tmp_dir = tempfile.mkdtemp()

    # Ingest file
    if uploaded_file:
        file_name = uploaded_file.name
        file_path = os.path.join(tmp_dir, file_name)
        with open(file_path, "wb") as f:
            f.write(uploaded_file.getbuffer())
        df = io_utils.load_file(file_path, auto_clean_header=auto_detect_headers)
        st.success(f"Uploaded & Ingested: **{file_name}** ({df.shape[0]} rows, {df.shape[1]} columns)")
    else:
        file_name = os.path.basename(sample_file_path)
        file_path = sample_file_path
        df = io_utils.load_file(file_path, auto_clean_header=auto_detect_headers)
        st.success(f"Loaded Sample Dataset: **{file_name}** ({df.shape[0]} rows, {df.shape[1]} columns)")

    # Load config (fallback if config missing)
    config = {}
    if os.path.exists("config/config.yaml"):
        try:
            config = load_config("config/config.yaml") or {}
        except Exception:
            config = {}

    # --- 1. Raw Data Preview & Profiling ---
    st.subheader("🔎 1. Raw Data Preview & Profiling")
    st.dataframe(df.head(10), use_container_width=True)

    # Basic statistics & profiling
    prof_col1, prof_col2, prof_col3, prof_col4 = st.columns(4)
    prof_col1.metric("Total Rows", f"{df.shape[0]:,}")
    prof_col2.metric("Total Columns", df.shape[1])
    prof_col3.metric("Missing Values", f"{df.isnull().sum().sum():,}")
    prof_col4.metric("Duplicate Rows", f"{df.duplicated().sum():,}")

    with st.expander("Column Types & Summary Statistics", expanded=False):
        st.dataframe(df.describe(include="all").transpose(), use_container_width=True)

    # --- 2. Data Cleaning ---
    df_clean = cleaning.clean_data(df, config.get("cleaning", {}))

    # --- 3. Validation ---
    issues = validation.validate_data(df_clean, config.get("validation", []))

    # --- 4. Anomaly Detection ---
    anomalies_found = anomalies.detect_anomalies(df_clean)

    # --- 5. Visualizations ---
    # Static figures for HTML report
    tmp_fig_dir = os.path.join(tmp_dir, "figures")
    static_figs = visualize.generate_visuals(df_clean, tmp_fig_dir)

    # Interactive Plotly figures for Streamlit UI
    interactive_figs = visualize.generate_interactive_visuals(df_clean)

    # --- 6. Predictive Insights ---
    insights = {}
    if enable_insights:
        insights = predictive.run_predictive_models(df_clean, num_clusters=num_clusters)
        if "clustering" in insights and isinstance(insights["clustering"], dict):
            insights["clustering"]["summary"] = f"Identified {num_clusters} business clusters in the dataset"

    # Save cleaned file
    base_name, _ = os.path.splitext(file_name)
    cleaned_filename = f"cleaned_{base_name}.csv"
    cleaned_path = os.path.join(tmp_dir, cleaned_filename)
    df_clean.to_csv(cleaned_path, index=False)

    # --- Processing Summary ---
    summary = {
        "Original Rows": df.shape[0],
        "Original Columns": df.shape[1],
        "Cleaned Rows": df_clean.shape[0],
        "Columns After Cleaning": df_clean.shape[1],
        "Validation Issues Found": sum(len(v) for v in issues.values()),
        "Columns With Issues": len(issues),
        "Anomalies Detected": len(anomalies_found),
        "Output File": cleaned_filename,
    }

    # Generate HTML report
    report_path = os.path.join(tmp_dir, "report.html")
    reporting.generate_report(issues, anomalies_found, static_figs, summary, insights, report_path)

    # --- Processing Summary UI ---
    st.markdown("---")
    st.subheader("2. Processing & Cleaning Summary")

    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("Original Rows", summary["Original Rows"])
        st.metric("Original Columns", summary["Original Columns"])
    with col2:
        st.metric("Cleaned Rows", summary["Cleaned Rows"])
        st.metric("Columns After Cleaning", summary["Columns After Cleaning"])
    with col3:
        st.metric("Validation Issues", summary["Validation Issues Found"])
        st.metric("Anomalies Detected", summary["Anomalies Detected"])

    # --- 3. Interactive Visualizations Section ---
    st.markdown("---")
    st.subheader("3. Interactive Visual Analytics")

    if interactive_figs:
        # Row 1: Top Products / Items and Category Breakdown
        ch_c1, ch_c2 = st.columns(2)
        with ch_c1:
            if "top_products" in interactive_figs:
                st.plotly_chart(interactive_figs["top_products"], use_container_width=True)
            elif "missing_values" in interactive_figs:
                st.plotly_chart(interactive_figs["missing_values"], use_container_width=True)
        with ch_c2:
            if "category_breakdown" in interactive_figs:
                st.plotly_chart(interactive_figs["category_breakdown"], use_container_width=True)
            elif "correlation_matrix" in interactive_figs:
                st.plotly_chart(interactive_figs["correlation_matrix"], use_container_width=True)

        # Row 2: Monthly Trends and Distributions
        ch_c3, ch_c4 = st.columns(2)
        with ch_c3:
            if "monthly_trend" in interactive_figs:
                st.plotly_chart(interactive_figs["monthly_trend"], use_container_width=True)
            elif "distribution" in interactive_figs:
                st.plotly_chart(interactive_figs["distribution"], use_container_width=True)
        with ch_c4:
            if "correlation_matrix" in interactive_figs and "category_breakdown" in interactive_figs:
                st.plotly_chart(interactive_figs["correlation_matrix"], use_container_width=True)
            elif "distribution" in interactive_figs and "monthly_trend" in interactive_figs:
                st.plotly_chart(interactive_figs["distribution"], use_container_width=True)
    else:
        st.info("No numerical or categorical columns available to plot.")

    # --- 4. Predictive & Data-Driven Insights Section ---
    if enable_insights:
        st.markdown("---")
        st.subheader("4. Data-Driven & Predictive Insights")
        if insights:
            ins_col1, ins_col2 = st.columns(2)
            with ins_col1:
                for key, value in insights.items():
                    if key == "clustering":
                        continue
                    if isinstance(value, dict):
                        st.markdown(f"**{key.replace('_',' ').title()}:** {value.get('formula', '')}")
                        st.caption(value.get("interpretation", ""))
                    else:
                        st.markdown(f"**{key.replace('_',' ').title()}:** {value}")
            with ins_col2:
                if "clustering" in insights:
                    cl = insights["clustering"]
                    st.markdown(f"**Segmentation:** {cl.get('summary', '')}")
                    st.caption(cl.get("interpretation", ""))
                    if "image" in cl:
                        st.image(f"data:image/png;base64,{cl['image']}")
        else:
            st.info("No predictive insights triggered for this column structure.")

    # --- 5. Natural Language Query Box ---
    st.markdown("---")
    st.subheader("5. Ask DataPilot (Natural Language Query)")
    st.caption("Ask business questions about the dataset. The query is computed directly using DuckDB / Pandas.")

    # Quick prompt buttons
    q_col1, q_col2, q_col3 = st.columns(3)
    quick_q = ""
    with q_col1:
        if st.button("Highest profit product?", use_container_width=True):
            quick_q = "Which product generated the highest profit?"
    with q_col2:
        if st.button("Total revenue?", use_container_width=True):
            quick_q = "What is the total revenue?"
    with q_col3:
        if st.button("Sales by category?", use_container_width=True):
            quick_q = "Sales by category"

    query_input = st.text_input(
        "Enter your question:",
        value=quick_q,
        placeholder="e.g. Which product generated the highest profit? or Total sales by region"
    )

    if query_input:
        engine = DataPilotQueryEngine(df_clean)
        # Infer column roles for query engine
        from src.analytics import infer_business_columns
        roles = infer_business_columns(df_clean)
        result = engine.ask(query_input, roles)

        st.success(result["answer"])
        with st.expander("Show Executed SQL", expanded=False):
            st.code(result["executed_sql"], language="sql")
        if not result["data"].empty:
            st.dataframe(result["data"], use_container_width=True)

    # --- 6. Outputs & Reports Section ---
    st.markdown("---")
    st.subheader("6. Download Outputs & Report")

    out_c1, out_c2, out_c3 = st.columns(3)
    with out_c1:
        with open(cleaned_path, "rb") as f:
            st.download_button("Download Cleaned Dataset (CSV)", data=f, file_name=cleaned_filename, mime="text/csv")

    with out_c2:
        if report_type in ["HTML", "Both"]:
            if os.path.exists(report_path):
                with open(report_path, "rb") as f:
                    st.download_button("Download Report (HTML)", data=f, file_name="DataPilot_Report.html", mime="text/html")

    with out_c3:
        if report_type in ["PDF", "Both"]:
            pdf_path = report_path.replace(".html", ".pdf")
            if os.path.exists(pdf_path):
                with open(pdf_path, "rb") as f:
                    st.download_button("Download Report (PDF)", data=f, file_name="DataPilot_Report.pdf", mime="application/pdf")
            else:
                st.caption("PDF export requires wkhtmltopdf")

else:
    st.info("Upload a CSV / Excel file or select a sample dataset in the sidebar to start analysis.")
