import streamlit as st
import os
import pandas as pd
import numpy as np
import tempfile

from src import cleaning, validation, anomalies, visualize, reporting, io_utils, predictive
from src.main import load_config
from src.analytics import infer_business_columns
from src.query_engine import DataPilotQueryEngine

# -- Page Config ---------------------------------------------------------------
st.set_page_config(
    page_title="DataPilot - AI Data Analyst",
    page_icon="D",
    layout="wide",
)

# -- Title ---------------------------------------------------------------------
st.title("DataPilot")
st.caption("Upload a **CSV** or **Excel** file to clean, validate, detect anomalies, "
           "analyze business metrics, and generate interactive visualizations.")

# -- Sidebar Controls ----------------------------------------------------------
st.sidebar.header("Settings & Pipeline")

enable_insights = st.sidebar.checkbox("Enable Predictive Insights & ML", value=True)
report_type = st.sidebar.radio("Report Type", ["HTML", "PDF", "Both"], index=0)
num_clusters = st.sidebar.slider(
    "Number of Clusters (KMeans)", min_value=2, max_value=6, value=3
)

st.sidebar.markdown("---")
st.sidebar.subheader("Data Source")
input_choice = st.sidebar.radio(
    "Input Method",
    ["Upload File (CSV / Excel)", "Use Sample Dataset"],
    index=0,
)

auto_detect_headers = st.sidebar.checkbox(
    "Smart Header Auto-Detection",
    value=True,
    help="Automatically strips title banners, empty leading rows/columns, "
         "and detects true table headers.",
)

uploaded_file = None
sample_file_path = None

if input_choice == "Upload File (CSV / Excel)":
    uploaded_file = st.sidebar.file_uploader(
        "Upload CSV or Excel file", type=["csv", "xlsx", "xls"]
    )
else:
    # Discover samples in sample_data/
    sample_dir = "sample_data"
    if os.path.isdir(sample_dir):
        sample_files = sorted(
            f for f in os.listdir(sample_dir)
            if f.endswith((".csv", ".xlsx", ".xls")) and not f.startswith("create")
        )
    else:
        sample_files = []

    if sample_files:
        chosen_sample = st.sidebar.selectbox("Choose sample file", sample_files)
        sample_file_path = os.path.join(sample_dir, chosen_sample)
    else:
        st.sidebar.warning("No sample files found in sample_data/")

# -- Main Pipeline -------------------------------------------------------------
if uploaded_file or sample_file_path:
    tmp_dir = tempfile.mkdtemp()

    # -- Ingest file -----------------------------------------------------------
    if uploaded_file:
        file_name = uploaded_file.name
        file_path = os.path.join(tmp_dir, file_name)
        with open(file_path, "wb") as f:
            f.write(uploaded_file.getbuffer())
        df = io_utils.load_file(file_path, auto_clean_header=auto_detect_headers)
        st.success(
            f"Uploaded & Ingested: **{file_name}** "
            f"({df.shape[0]:,} rows, {df.shape[1]} columns)"
        )
    else:
        file_name = os.path.basename(sample_file_path)
        file_path = sample_file_path
        df = io_utils.load_file(file_path, auto_clean_header=auto_detect_headers)
        st.success(
            f"Loaded Sample Dataset: **{file_name}** "
            f"({df.shape[0]:,} rows, {df.shape[1]} columns)"
        )

    # -- Load config (fallback if config missing) ------------------------------
    config = {}
    if os.path.exists("config/config.yaml"):
        try:
            config = load_config("config/config.yaml") or {}
        except Exception:
            config = {}

    # =========================================================================
    # 1. Raw Data Preview & Profiling
    # =========================================================================
    st.markdown("---")
    st.subheader("1. Raw Data Preview & Profiling")
    st.dataframe(df.head(10), width="stretch")

    # Profiling metrics
    prof_col1, prof_col2, prof_col3, prof_col4 = st.columns(4)
    prof_col1.metric("Total Rows", f"{df.shape[0]:,}")
    prof_col2.metric("Total Columns", df.shape[1])
    prof_col3.metric("Missing Values", f"{df.isnull().sum().sum():,}")
    prof_col4.metric("Duplicate Rows", f"{df.duplicated().sum():,}")

    with st.expander("Column Types & Summary Statistics", expanded=False):
        st.dataframe(df.describe(include="all").transpose(), width="stretch")

    # =========================================================================
    # 2. Data Cleaning
    # =========================================================================
    # Pass the full config dict -- clean_data() reads top-level keys
    # like 'drop_duplicates', 'fill_missing', 'date_columns' etc.
    df_clean = cleaning.clean_data(df, config)

    # =========================================================================
    # 3. Validation
    # =========================================================================
    # Config uses 'validation_rules' not 'validation'
    issues = validation.validate_data(df_clean, config.get("validation_rules", []))

    # =========================================================================
    # 4. Anomaly Detection
    # =========================================================================
    anomalies_found = anomalies.detect_anomalies(df_clean)

    # =========================================================================
    # 5. Visualizations
    # =========================================================================
    # Static figures for HTML report
    tmp_fig_dir = os.path.join(tmp_dir, "figures")
    static_figs = visualize.generate_visuals(df_clean, tmp_fig_dir)

    # Interactive Plotly figures for Streamlit UI
    interactive_figs = visualize.generate_interactive_visuals(df_clean)

    # =========================================================================
    # 6. Predictive Insights
    # =========================================================================
    insights = {}
    if enable_insights:
        insights = predictive.run_predictive_models(df_clean, num_clusters=num_clusters)
        if "clustering" in insights and isinstance(insights["clustering"], dict):
            insights["clustering"]["summary"] = (
                f"Identified {num_clusters} business clusters in the dataset"
            )

    # -- Save cleaned file -----------------------------------------------------
    base_name, _ = os.path.splitext(file_name)
    cleaned_filename = f"cleaned_{base_name}.csv"
    cleaned_path = os.path.join(tmp_dir, cleaned_filename)
    df_clean.to_csv(cleaned_path, index=False)

    # -- Processing Summary ----------------------------------------------------
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
    reporting.generate_report(
        issues, anomalies_found, static_figs, summary, insights, report_path
    )

    # =========================================================================
    # 2. Processing & Cleaning Summary (UI)
    # =========================================================================
    st.markdown("---")
    st.subheader("2. Processing & Cleaning Summary")

    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("Original Rows", f"{summary['Original Rows']:,}")
        st.metric("Original Columns", summary["Original Columns"])
    with col2:
        st.metric("Cleaned Rows", f"{summary['Cleaned Rows']:,}")
        st.metric("Columns After Cleaning", summary["Columns After Cleaning"])
    with col3:
        st.metric("Validation Issues", summary["Validation Issues Found"])
        st.metric("Anomalies Detected", summary["Anomalies Detected"])

    # Show validation details if any
    if issues:
        with st.expander("Validation Issues Detail", expanded=False):
            for col_name, col_issues in issues.items():
                st.markdown(f"**{col_name}**: " + ", ".join(col_issues))

    # Show anomaly details if any
    if anomalies_found:
        with st.expander("Anomaly Details", expanded=False):
            for col_name, values in anomalies_found.items():
                st.markdown(
                    f"**{col_name}**: {len(values)} outlier(s) -- "
                    f"values: {', '.join(str(v) for v in values[:10])}"
                    + (" ..." if len(values) > 10 else "")
                )

    # =========================================================================
    # 3. Interactive Visual Analytics
    # =========================================================================
    st.markdown("---")
    st.subheader("3. Interactive Visual Analytics")

    if interactive_figs:
        # Build tab names dynamically based on available charts
        tab_config = []
        if "top_products" in interactive_figs:
            tab_config.append(("Top Items", "top_products"))
        if "category_breakdown" in interactive_figs:
            tab_config.append(("Category", "category_breakdown"))
        if "monthly_trend" in interactive_figs:
            tab_config.append(("Trends", "monthly_trend"))
        if "correlation_matrix" in interactive_figs:
            tab_config.append(("Correlation", "correlation_matrix"))
        if "regression_model" in interactive_figs:
            tab_config.append(("Regression", "regression_model"))
        if "missing_values" in interactive_figs:
            tab_config.append(("Missing Values", "missing_values"))

        # Collect distribution tabs
        dist_keys = sorted(k for k in interactive_figs if k.startswith("distribution"))
        if dist_keys:
            tab_config.append(("Distributions", dist_keys))

        if tab_config:
            tab_labels = [t[0] for t in tab_config]
            tabs = st.tabs(tab_labels)

            for tab, (label, key_or_keys) in zip(tabs, tab_config):
                with tab:
                    if isinstance(key_or_keys, list):
                        # Multiple distribution charts
                        for dk in key_or_keys:
                            st.plotly_chart(
                                interactive_figs[dk],
                                width="stretch",
                                key=f"chart_{dk}",
                            )
                    else:
                        st.plotly_chart(
                            interactive_figs[key_or_keys],
                            width="stretch",
                            key=f"chart_{key_or_keys}",
                        )
    else:
        st.info("No numerical or categorical columns available to plot.")

    # =========================================================================
    # 4. Predictive & Data-Driven Insights
    # =========================================================================
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
                        st.markdown(
                            f"**{key.replace('_', ' ').title()}:** "
                            f"`{value.get('formula', '')}`"
                        )
                        if "r2" in value:
                            st.markdown(
                                f"**Fit Quality (R2):** `{value['r2']}` | "
                                f"**Slope:** `{value.get('slope', '')}` | "
                                f"**Intercept:** `{value.get('intercept', '')}`"
                            )
                        st.caption(value.get("interpretation", ""))
                        if "image" in value and value["image"]:
                            st.image(f"data:image/png;base64,{value['image']}")
                        elif "regression_model" in interactive_figs:
                            st.plotly_chart(
                                interactive_figs["regression_model"],
                                width="stretch",
                                key="predictive_reg_chart",
                            )
                    else:
                        st.markdown(f"**{key.replace('_', ' ').title()}:** {value}")
            with ins_col2:
                if "clustering" in insights:
                    cl = insights["clustering"]
                    st.markdown(f"**Segmentation:** {cl.get('summary', '')}")
                    st.caption(cl.get("interpretation", ""))
                    if "image" in cl:
                        st.image(f"data:image/png;base64,{cl['image']}")
        else:
            st.info("No predictive insights triggered for this column structure.")

    # =========================================================================
    # 5. Natural Language Query Box
    # =========================================================================
    st.markdown("---")
    st.subheader("5. Ask DataPilot (Natural Language Query)")
    st.caption(
        "Ask business questions about the dataset. The query is computed "
        "directly using DuckDB / Pandas -- zero hallucination."
    )

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
        placeholder="e.g. Which product generated the highest profit? or Total sales by region",
    )

    if query_input:
        engine = DataPilotQueryEngine(df_clean)
        roles = infer_business_columns(df_clean)
        result = engine.ask(query_input, roles)

        st.success(result["answer"])
        with st.expander("Show Executed SQL", expanded=False):
            st.code(result["executed_sql"], language="sql")
        if not result["data"].empty:
            st.dataframe(result["data"], width="stretch")

    # =========================================================================
    # 6. Download Outputs & Report
    # =========================================================================
    st.markdown("---")
    st.subheader("6. Download Outputs & Report")

    out_c1, out_c2, out_c3 = st.columns(3)
    with out_c1:
        with open(cleaned_path, "rb") as f:
            st.download_button(
                "Download Cleaned Dataset (CSV)",
                data=f,
                file_name=cleaned_filename,
                mime="text/csv",
            )

    with out_c2:
        if report_type in ["HTML", "Both"]:
            if os.path.exists(report_path):
                with open(report_path, "rb") as f:
                    st.download_button(
                        "Download Report (HTML)",
                        data=f,
                        file_name="DataPilot_Report.html",
                        mime="text/html",
                    )

    with out_c3:
        if report_type in ["PDF", "Both"]:
            pdf_path = report_path.replace(".html", ".pdf")
            if os.path.exists(pdf_path):
                with open(pdf_path, "rb") as f:
                    st.download_button(
                        "Download Report (PDF)",
                        data=f,
                        file_name="DataPilot_Report.pdf",
                        mime="application/pdf",
                    )
            else:
                st.caption("PDF export requires wkhtmltopdf to be installed.")

else:
    st.info(
        "Upload a CSV / Excel file or select a sample dataset "
        "in the sidebar to start analysis."
    )
