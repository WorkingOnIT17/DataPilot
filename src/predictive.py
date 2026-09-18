import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.cluster import KMeans
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import base64
import io

def _fig_to_base64():
    """Helper: Convert matplotlib figure to base64 string."""
    buf = io.BytesIO()
    plt.savefig(buf, format="png", bbox_inches="tight", dpi=100)
    plt.close()
    buf.seek(0)
    return base64.b64encode(buf.read()).decode("utf-8")

def run_predictive_models(df: pd.DataFrame, num_clusters: int = 3, **kwargs) -> dict:
    """
    Run predictive models and clustering on dataset.
    Accepts num_clusters and optional kwargs.
    """
    insights = {}

    # --- Example 1: Salary / Regression prediction ---
    reg_x, reg_y = None, None
    if "Experience" in df.columns and "Salary" in df.columns:
        reg_x, reg_y = "Experience", "Salary"
    elif "Quantity" in df.columns and "Sales" in df.columns:
        reg_x, reg_y = "Quantity", "Sales"
    elif "Units" in df.columns and "Total" in df.columns:
        reg_x, reg_y = "Units", "Total"

    if reg_x and reg_y:
        valid = df.dropna(subset=[reg_x, reg_y])
        if len(valid) >= 3:
            try:
                X = valid[[reg_x]].values
                y = valid[reg_y].values

                model = LinearRegression()
                model.fit(X, y)
                coef = model.coef_[0]
                intercept = model.intercept_

                formula = f"{reg_y} = {coef:.2f} * {reg_x} + {intercept:.2f}"
                interpretation = (
                    f"Each additional unit of {reg_x} changes {reg_y} by approximately {coef:.2f}. "
                    f"Baseline starts around {intercept:.2f}."
                )

                insights["salary_prediction" if reg_y == "Salary" else "regression_model"] = {
                    "formula": formula,
                    "interpretation": interpretation
                }
            except Exception:
                pass

    # --- Example 2: Clustering ---
    numeric_df = df.select_dtypes(include=[np.number]).dropna()
    if numeric_df.shape[1] >= 2 and len(numeric_df) >= 2:
        try:
            # Safe cluster count: at most number of samples
            safe_k = max(2, min(int(num_clusters), len(numeric_df)))

            kmeans = KMeans(n_clusters=safe_k, n_init="auto", random_state=42)
            clusters = kmeans.fit_predict(numeric_df)

            cluster_info = f"Identified {safe_k} clusters in the dataset"
            interpretation = (
                f"These {safe_k} clusters group records with similar numeric behavior across features. "
                "Useful for customer/product segmentation and pattern discovery."
            )

            # --- Visualization ---
            plt.figure(figsize=(6, 4))
            plt.scatter(
                numeric_df.iloc[:, 0], numeric_df.iloc[:, 1],
                c=clusters, cmap="viridis", marker="o", alpha=0.7
            )
            plt.scatter(
                kmeans.cluster_centers_[:, 0], kmeans.cluster_centers_[:, 1],
                c="red", marker="x", s=200, linewidths=3, label="Centroids"
            )
            plt.xlabel(numeric_df.columns[0])
            plt.ylabel(numeric_df.columns[1])
            plt.title(f"KMeans Clustering (k={safe_k})")
            plt.legend()
            plt.tight_layout()

            cluster_img = _fig_to_base64()

            insights["clustering"] = {
                "summary": cluster_info,
                "interpretation": interpretation,
                "image": cluster_img
            }
        except Exception as e:
            print(f"[CLUSTER_WARN] Clustering skipped: {e}")

    return insights
