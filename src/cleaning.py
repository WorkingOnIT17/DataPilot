import pandas as pd
import numpy as np

def load_data(filepath):
    """Load file into a pandas DataFrame."""
    print(f"[LOADING] Loading file: {filepath}")
    df = pd.read_excel(filepath) if filepath.endswith(('.xlsx', '.xls')) else pd.read_csv(filepath)
    print(f"[SUCCESS] Loaded {len(df)} rows and {len(df.columns)} columns")
    return df

def clean_data(df: pd.DataFrame, config: dict) -> pd.DataFrame:
    """Clean the dataset based on config rules."""
    print("[CLEANING] Starting data cleaning...")
    df = df.copy()

    # Smart numeric & object inference
    for col in df.columns:
        # Try converting object columns that are actually numbers
        if df[col].dtype == "object":
            try:
                df[col] = pd.to_numeric(df[col])
            except (ValueError, TypeError):
                pass

    # Drop duplicates
    if config.get("drop_duplicates", True):
        before = len(df)
        df = df.drop_duplicates()
        after = len(df)
        print(f"[DUPLICATES] Removed {before - after} duplicate rows")

    # Handle missing values
    fill_cfg = config.get("fill_missing", {})
    strategy = fill_cfg.get("strategy", "median")
    threshold = fill_cfg.get("threshold", 0.3)

    # Drop rows if too many missing values
    row_threshold = int(threshold * df.shape[1])
    before = len(df)
    df = df.dropna(thresh=row_threshold)
    after = len(df)
    print(f"[THRESHOLD] Dropped {before - after} rows with too many missing values")

    # Fill remaining missing values
    for col in df.columns:
        if df[col].isna().any():
            if pd.api.types.is_numeric_dtype(df[col]):
                if strategy == "mean":
                    value = df[col].mean()
                else:  # default to median
                    value = df[col].median()
                df[col] = df[col].fillna(value)
                print(f"[IMPUTE] Filled NaNs in numeric column '{col}' with {strategy} ({value:.2f})")
            else:
                df[col] = df[col].fillna("Unknown")
                print(f"[IMPUTE] Filled NaNs in text column '{col}' with 'Unknown'")

    # Standardize text columns safely
    text_std = config.get("text_standardization", "title")
    for col in df.select_dtypes(include=["object"]).columns:
        try:
            if text_std == "lower":
                df[col] = df[col].apply(lambda x: str(x).lower() if isinstance(x, str) else x)
            elif text_std == "upper":
                df[col] = df[col].apply(lambda x: str(x).upper() if isinstance(x, str) else x)
            elif text_std == "title":
                df[col] = df[col].apply(lambda x: str(x).title() if isinstance(x, str) else x)
        except Exception as e:
            print(f"[TEXT_WARN] Could not standardize text in '{col}': {e}")

    # Fix date columns
    default_date_fmt = config.get("date_format", "%Y-%m-%d")
    date_columns_config = config.get("date_columns", [])

    for col in df.columns:
        if "date" in str(col).lower():
            col_config = next((c for c in date_columns_config if isinstance(c, dict) and c.get("name") == col), {})
            date_fmt = col_config.get("format", default_date_fmt)

            try:
                df[col] = pd.to_datetime(df[col], errors="coerce", format=date_fmt).dt.strftime(default_date_fmt)
                print(f"[DATE] Standardized '{col}' to format {default_date_fmt}")
            except Exception as e:
                print(f"[DATE_WARN] Could not standardize '{col}': {e}")

    print("[SUCCESS] Cleaning complete")
    return df
