import pandas as pd
import numpy as np
from typing import Dict, Optional, List

def infer_business_columns(df: pd.DataFrame) -> Dict[str, Optional[str]]:
    """
    Infer column roles: date, revenue, profit, quantity, product, category, region.
    """
    roles = {
        "date": None,
        "revenue": None,
        "profit": None,
        "quantity": None,
        "product": None,
        "category": None,
        "region": None,
    }

    cols = list(df.columns)
    cols_lower = {str(c).lower().replace(" ", "_"): c for c in cols}

    for key, orig in cols_lower.items():
        if not roles["date"] and ("date" in key or "time" in key or pd.api.types.is_datetime64_any_dtype(df[orig])):
            roles["date"] = orig
        elif not roles["revenue"] and key in ["sales", "revenue", "total", "total_(usd)", "subscription_cost", "cost_price_total_(usd)"]:
            roles["revenue"] = orig
        elif not roles["profit"] and "profit" in key:
            roles["profit"] = orig
        elif not roles["quantity"] and key in ["quantity", "qty", "units", "units_sold", "number_of_units"]:
            roles["quantity"] = orig
        elif not roles["product"] and key in ["product_name", "product", "item", "item_name", "product_id"]:
            roles["product"] = orig
        elif not roles["category"] and key in ["category", "segment", "subscription_interval", "department", "type"]:
            roles["category"] = orig
        elif not roles["region"] and key in ["region", "country", "city", "location", "rep"]:
            roles["region"] = orig

    # Fallbacks
    num_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    if not roles["revenue"] and num_cols:
        roles["revenue"] = num_cols[-1]

    text_cols = df.select_dtypes(include=["object", "category"]).columns.tolist()
    if not roles["product"] and text_cols:
        roles["product"] = text_cols[0]

    return roles
