import pandas as pd
import numpy as np
from scipy import stats

def detect_anomalies(df: pd.DataFrame, z_thresh: float = 3.0) -> dict:
    """
    Detect anomalies in numeric columns using Z-score method.
    Returns a dictionary with column name -> list of anomalies.
    """
    print("[ANOMALIES] Starting anomaly detection...")
    anomalies = {}

    numeric_cols = df.select_dtypes(include=[np.number]).columns
    for col in numeric_cols:
        try:
            valid = df[col].dropna()
            if len(valid) > 3 and valid.std() > 0:
                z_scores = np.abs(stats.zscore(valid))
                outliers = valid[(z_scores > z_thresh)]
                if not outliers.empty:
                    anomalies[col] = outliers.tolist()
                    print(f"[ANOMALY_FOUND] Found {len(outliers)} anomalies in '{col}'")
        except Exception as e:
            print(f"[ANOMALY_WARN] Could not compute anomalies for '{col}': {e}")

    if not anomalies:
        print("[ANOMALIES_OK] No anomalies detected")

    return anomalies
