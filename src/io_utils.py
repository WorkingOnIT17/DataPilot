import os
import pandas as pd
import numpy as np

def detect_and_clean_header(df_raw: pd.DataFrame) -> pd.DataFrame:
    """
    Automatically detects if an Excel or CSV file has title/metadata banner rows
    (e.g., 'Unnamed: 0' columns, leading empty rows) and extracts the true header row.
    Also strips completely blank leading/trailing columns and newline characters from column headers.
    """
    if df_raw.empty:
        return df_raw

    # Check if headers look unparsed (mostly Unnamed or NaNs)
    unnamed_cols = [c for c in df_raw.columns if str(c).startswith("Unnamed:") or pd.isna(c)]
    needs_header_detection = len(unnamed_cols) >= max(1, len(df_raw.columns) / 2)

    if needs_header_detection:
        best_row_idx = None
        max_valid_cols = 0

        # Scan the first 15 rows for the row with the most non-empty string entries
        for idx in range(min(15, len(df_raw))):
            row_vals = df_raw.iloc[idx]
            valid_count = sum(
                pd.notna(v) and str(v).strip() != "" and not str(v).lower().startswith("unnamed")
                for v in row_vals
            )
            if valid_count > max_valid_cols:
                max_valid_cols = valid_count
                best_row_idx = idx

        if best_row_idx is not None and max_valid_cols >= 2:
            new_headers = df_raw.iloc[best_row_idx].tolist()
            df = df_raw.iloc[best_row_idx + 1:].reset_index(drop=True)
            df.columns = new_headers
            df_raw = df

    # Drop completely empty columns and rows
    df_clean = df_raw.dropna(how="all", axis=1).dropna(how="all", axis=0)

    # Clean up column names (remove newlines, trim spaces, fill empty names)
    clean_cols = []
    for i, c in enumerate(df_clean.columns):
        c_str = str(c).replace("\n", " ").replace("\r", "").strip() if pd.notna(c) else ""
        if not c_str or c_str.lower().startswith("unnamed:"):
            clean_cols.append(f"Column_{i+1}")
        else:
            clean_cols.append(c_str)
    df_clean.columns = clean_cols

    # Reset index and infer proper dtypes
    df_clean = df_clean.reset_index(drop=True)
    return df_clean


def load_file(path_or_buffer, auto_clean_header: bool = True) -> pd.DataFrame:
    """Load a CSV or Excel file into a pandas DataFrame with smart header detection."""
    try:
        if isinstance(path_or_buffer, str):
            fname = path_or_buffer
        else:
            fname = getattr(path_or_buffer, "name", "")

        ext = os.path.splitext(fname)[1].lower()

        if ext in [".xlsx", ".xls"]:
            df = pd.read_excel(path_or_buffer)
        elif ext == ".csv":
            try:
                df = pd.read_csv(path_or_buffer)
            except UnicodeDecodeError:
                if hasattr(path_or_buffer, "seek"):
                    path_or_buffer.seek(0)
                df = pd.read_csv(path_or_buffer, encoding="latin-1")
        else:
            try:
                df = pd.read_excel(path_or_buffer)
            except Exception:
                if hasattr(path_or_buffer, "seek"):
                    path_or_buffer.seek(0)
                df = pd.read_csv(path_or_buffer)

        if auto_clean_header:
            df = detect_and_clean_header(df)

        print(f"[LOADED] File: {fname} with {df.shape[0]} rows and {df.shape[1]} columns")
        return df
    except Exception as e:
        print(f"[ERROR] Error loading file: {e}")
        raise


def load_excel(path: str) -> pd.DataFrame:
    """Backward-compatible Excel loader."""
    return load_file(path)


def save_file(df: pd.DataFrame, path: str):
    """Save a pandas DataFrame to CSV or Excel depending on extension."""
    try:
        ext = os.path.splitext(path)[1].lower()
        if ext == ".csv":
            df.to_csv(path, index=False)
        else:
            df.to_excel(path, index=False)
        print(f"[SAVED] File: {path}")
    except Exception as e:
        print(f"[ERROR] Error saving file: {e}")
        raise


def save_excel(df: pd.DataFrame, path: str):
    """Backward-compatible Excel saver."""
    save_file(df, path)
