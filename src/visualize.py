import os
import base64
from io import BytesIO
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go

def _fig_to_base64(fig) -> str:
    """Convert a matplotlib figure to a base64 string."""
    buf = BytesIO()
    fig.savefig(buf, format="png", bbox_inches="tight", facecolor=fig.get_facecolor(), dpi=100)
    buf.seek(0)
    img_b64 = base64.b64encode(buf.read()).decode("utf-8")
    plt.close(fig)
    return img_b64

def generate_visuals(df: pd.DataFrame, output_dir: str) -> dict:
    """
    Generate static matplotlib/seaborn charts for report generation.
    """
    print("[VISUALS] Generating visualizations for report...")
    figs = {}
    os.makedirs(output_dir, exist_ok=True)

    # Apply dark style
    plt.style.use('dark_background')
    sns.set_style("darkgrid")

    # 1. Missing values heatmap
    if df.isnull().sum().sum() > 0:
        try:
            fig, ax = plt.subplots(figsize=(8, 4))
            sns.heatmap(df.isnull(), cbar=False, cmap="viridis", ax=ax)
            ax.set_title("Missing Values Heatmap", color='white')
            path = os.path.join(output_dir, "missing_values.png")
            fig.savefig(path, facecolor=fig.get_facecolor(), bbox_inches="tight")
            figs["missing_values"] = _fig_to_base64(fig)
        except Exception as e:
            print(f"[VISUAL_WARN] Missing values plot error: {e}")

    # 2. Correlation heatmap
    numeric_df = df.select_dtypes(include=["number"])
    if not numeric_df.empty and numeric_df.shape[1] > 1:
        try:
            fig, ax = plt.subplots(figsize=(8, 6))
            sns.heatmap(numeric_df.corr(), annot=True, cmap="coolwarm", ax=ax, fmt=".2f")
            ax.set_title("Correlation Heatmap", color='white')
            path = os.path.join(output_dir, "correlation_matrix.png")
            fig.savefig(path, facecolor=fig.get_facecolor(), bbox_inches="tight")
            figs["correlation_matrix"] = _fig_to_base64(fig)
        except Exception as e:
            print(f"[VISUAL_WARN] Correlation heatmap error: {e}")

    # 3. Distribution plots for numeric columns (up to 3)
    if not numeric_df.empty:
        for col in numeric_df.columns[:3]:
            try:
                valid_data = numeric_df[col].dropna()
                if not valid_data.empty:
                    fig, ax = plt.subplots(figsize=(6, 4))
                    sns.histplot(valid_data, kde=True, bins=25, color="#1f77b4", ax=ax)
                    ax.set_title(f"Distribution of {col}", color='white')
                    path = os.path.join(output_dir, f"dist_{col}.png")
                    fig.savefig(path, facecolor=fig.get_facecolor(), bbox_inches="tight")
                    figs[f"dist_{col}"] = _fig_to_base64(fig)
            except Exception as e:
                print(f"[VISUAL_WARN] Distribution error for {col}: {e}")

    # 4. Bar plot for first categorical column frequencies
    cat_df = df.select_dtypes(include=["object", "category"])
    if not cat_df.empty:
        col = cat_df.columns[0]
        try:
            val_counts = df[col].value_counts().head(10)
            if not val_counts.empty:
                fig, ax = plt.subplots(figsize=(7, 4))
                val_counts.plot(kind="bar", color="#ff7f0e", ax=ax)
                ax.set_title(f"Top 10 Frequency: {col}", color='white')
                plt.xticks(rotation=45, ha="right")
                path = os.path.join(output_dir, f"freq_{col}.png")
                fig.savefig(path, facecolor=fig.get_facecolor(), bbox_inches="tight")
                figs[f"freq_{col}"] = _fig_to_base64(fig)
        except Exception as e:
            print(f"[VISUAL_WARN] Frequency plot error for {col}: {e}")

    print(f"[VISUALS_OK] Generated {len(figs)} figures successfully")
    return figs


def generate_interactive_visuals(df: pd.DataFrame) -> dict:
    """
    Generate interactive Plotly charts for the Streamlit dashboard:
    - Missing Values Overview
    - Top Products / Items
    - Category / Segment Breakdown
    - Monthly / Time Trends
    - Correlation Matrix
    - Numeric Feature Distributions
    """
    plotly_figs = {}

    # 1. Missing Values Bar Chart (if any)
    missing_counts = df.isnull().sum()
    missing_cols = missing_counts[missing_counts > 0]
    if not missing_cols.empty:
        miss_df = pd.DataFrame({
            "Column": missing_cols.index,
            "Missing_Count": missing_cols.values,
            "Missing_Pct": (missing_cols.values / len(df) * 100).round(1)
        }).sort_values(by="Missing_Count", ascending=True)

        fig_miss = px.bar(
            miss_df,
            x="Missing_Pct",
            y="Column",
            orientation="h",
            text="Missing_Pct",
            title="Missing Values by Column (%)",
            color="Missing_Pct",
            color_continuous_scale="Reds"
        )
        fig_miss.update_traces(texttemplate="%{text:.1f}%", textposition="outside")
        fig_miss.update_layout(template="plotly_white", margin=dict(l=10, r=10, t=40, b=10), height=320, coloraxis_showscale=False)
        plotly_figs["missing_values"] = fig_miss

    # Detect key business columns
    cols_lower = {str(c).lower().replace(" ", "_"): c for c in df.columns}
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    cat_cols = df.select_dtypes(include=["object", "category"]).columns.tolist()

    # Find metric (Revenue / Total / Sales / Profit / Units)
    metric_col = None
    for key in ["sales", "revenue", "total", "total_(usd)", "subscription_cost", "profit", "units", "quantity", "cost_price_total_(usd)"]:
        if key in cols_lower and cols_lower[key] in numeric_cols:
            metric_col = cols_lower[key]
            break
    if not metric_col and numeric_cols:
        metric_col = numeric_cols[0]

    # Find product / item column
    prod_col = None
    for key in ["product_name", "product", "item", "item_name", "product_id", "task_name"]:
        if key in cols_lower:
            prod_col = cols_lower[key]
            break

    # Find category / region column
    cat_col = None
    for key in ["category", "segment", "region", "rep", "subscription_interval", "department", "assigned_to"]:
        if key in cols_lower:
            cat_col = cols_lower[key]
            break
    if not cat_col and cat_cols:
        cat_col = cat_cols[0]

    # Find date column
    date_col = None
    for c in df.columns:
        if "date" in str(c).lower() or "time" in str(c).lower() or pd.api.types.is_datetime64_any_dtype(df[c]):
            date_col = c
            break

    # 2. Top Products / Items Chart
    if prod_col and metric_col:
        top_items = df.groupby(prod_col, as_index=False)[metric_col].sum().sort_values(by=metric_col, ascending=False).head(10)
        fig_top = px.bar(
            top_items,
            x=prod_col,
            y=metric_col,
            text=metric_col,
            title=f"Top 10 {prod_col} by {metric_col}",
            color=metric_col,
            color_continuous_scale="Blues"
        )
        fig_top.update_traces(texttemplate="%{text:,.2s}", textposition="outside")
        fig_top.update_layout(template="plotly_white", margin=dict(l=10, r=10, t=40, b=10), height=360, coloraxis_showscale=False)
        plotly_figs["top_products"] = fig_top

    # 3. Category / Segment Breakdown (Pie / Donut)
    if cat_col and metric_col:
        cat_data = df.groupby(cat_col, as_index=False)[metric_col].sum().sort_values(by=metric_col, ascending=False)
        fig_cat = px.pie(
            cat_data,
            names=cat_col,
            values=metric_col,
            hole=0.4,
            title=f"{metric_col} Breakdown by {cat_col}",
            color_discrete_sequence=px.colors.qualitative.Prism
        )
        fig_cat.update_traces(textposition="inside", textinfo="percent+label")
        fig_cat.update_layout(template="plotly_white", margin=dict(l=10, r=10, t=40, b=10), height=360)
        plotly_figs["category_breakdown"] = fig_cat

    # 4. Time Trends (if date column exists)
    if date_col and metric_col:
        try:
            temp_df = df.copy()
            temp_df[date_col] = pd.to_datetime(temp_df[date_col], errors="coerce")
            temp_df = temp_df.dropna(subset=[date_col])
            if not temp_df.empty:
                trend_df = temp_df.set_index(date_col).resample("M")[metric_col].sum().reset_index()
                trend_df["Period"] = trend_df[date_col].dt.strftime("%Y-%m")
                fig_trend = px.line(
                    trend_df,
                    x="Period",
                    y=metric_col,
                    markers=True,
                    title=f"Monthly Trend: {metric_col}",
                    line_shape="linear"
                )
                fig_trend.update_traces(line_color="#4361EE", line_width=3)
                fig_trend.update_layout(template="plotly_white", margin=dict(l=10, r=10, t=40, b=10), height=360)
                plotly_figs["monthly_trend"] = fig_trend
        except Exception:
            pass

    # 5. Correlation Heatmap
    if len(numeric_cols) > 1:
        corr_matrix = df[numeric_cols].corr().round(2)
        fig_corr = px.imshow(
            corr_matrix,
            text_auto=True,
            aspect="auto",
            color_continuous_scale="RdBu_r",
            zmin=-1,
            zmax=1,
            title="Correlation Matrix"
        )
        fig_corr.update_layout(template="plotly_white", margin=dict(l=10, r=10, t=40, b=10), height=380)
        plotly_figs["correlation_matrix"] = fig_corr

    # 6. Feature Distribution (First Numeric Column)
    if numeric_cols:
        dist_col = numeric_cols[0]
        fig_dist = px.histogram(
            df.dropna(subset=[dist_col]),
            x=dist_col,
            marginal="box",
            title=f"Distribution of {dist_col}",
            color_discrete_sequence=["#4895EF"]
        )
        fig_dist.update_layout(template="plotly_white", margin=dict(l=10, r=10, t=40, b=10), height=340)
        plotly_figs["distribution"] = fig_dist

    return plotly_figs
