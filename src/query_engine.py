import pandas as pd
import duckdb
from typing import Dict, Any, Optional

class DataPilotQueryEngine:
    """
    Deterministic Natural Language Query Engine for DataPilot.
    Executes actual analytical computations on the dataset using DuckDB and Pandas.
    Guarantees zero hallucination of numbers.
    """

    def __init__(self, df: pd.DataFrame):
        self.df = df
        self.conn = duckdb.connect(database=":memory:")
        self.conn.register("dataset", df)

    def execute_sql(self, query: str) -> pd.DataFrame:
        try:
            return self.conn.execute(query).df()
        except Exception as e:
            raise RuntimeError(f"SQL Error: {str(e)}")

    def ask(self, query: str, roles: Dict[str, Optional[str]]) -> Dict[str, Any]:
        q = query.lower().strip()
        cols = list(self.df.columns)

        rev_col = roles.get("revenue")
        prof_col = roles.get("profit")
        prod_col = roles.get("product")
        cat_col = roles.get("category")
        reg_col = roles.get("region")

        # 1. Top / Highest profit
        if any(term in q for term in ["highest profit", "most profit", "top profit", "best profit"]):
            target_metric = prof_col or rev_col
            target_dim = prod_col or cat_col or cols[0]
            if target_metric and target_dim:
                sql = f'SELECT "{target_dim}", SUM("{target_metric}") AS "Total_{target_metric}" FROM dataset GROUP BY "{target_dim}" ORDER BY "Total_{target_metric}" DESC LIMIT 5'
                res_df = self.execute_sql(sql)
                if not res_df.empty:
                    top_name = res_df.iloc[0][target_dim]
                    top_val = res_df.iloc[0][f"Total_{target_metric}"]
                    return {
                        "executed_sql": sql,
                        "answer": f"The item with the highest total {target_metric} is **{top_name}** with **${top_val:,.2f}**.",
                        "data": res_df
                    }

        # 2. Total revenue / sales
        if any(term in q for term in ["total sales", "total revenue", "total amount"]):
            target_metric = rev_col or prof_col
            if target_metric:
                sql = f'SELECT SUM("{target_metric}") AS "Total_{target_metric}", AVG("{target_metric}") AS "Average_Per_Record", COUNT(*) AS "Total_Records" FROM dataset'
                res_df = self.execute_sql(sql)
                tot = res_df.iloc[0][f"Total_{target_metric}"]
                cnt = res_df.iloc[0]["Total_Records"]
                return {
                    "executed_sql": sql,
                    "answer": f"Total {target_metric} is **${tot:,.2f}** across **{cnt:,} records**.",
                    "data": res_df
                }

        # 3. Category breakdown
        if any(term in q for term in ["by category", "category sales", "category profit", "sales by category"]):
            target_dim = cat_col or "Category"
            target_metric = rev_col or prof_col
            if target_dim in self.df.columns and target_metric:
                sql = f'SELECT "{target_dim}", SUM("{target_metric}") AS "Total_{target_metric}" FROM dataset GROUP BY "{target_dim}" ORDER BY "Total_{target_metric}" DESC'
                res_df = self.execute_sql(sql)
                top_cat = res_df.iloc[0][target_dim]
                top_v = res_df.iloc[0][f"Total_{target_metric}"]
                return {
                    "executed_sql": sql,
                    "answer": f"Category breakdown: **{top_cat}** leads with **${top_v:,.2f}** in {target_metric}.",
                    "data": res_df
                }

        # 4. Regional breakdown
        if any(term in q for term in ["by region", "region sales", "sales by region"]):
            target_dim = reg_col or "Region"
            target_metric = rev_col or prof_col
            if target_dim in self.df.columns and target_metric:
                sql = f'SELECT "{target_dim}", SUM("{target_metric}") AS "Total_{target_metric}" FROM dataset GROUP BY "{target_dim}" ORDER BY "Total_{target_metric}" DESC'
                res_df = self.execute_sql(sql)
                top_r = res_df.iloc[0][target_dim]
                top_v = res_df.iloc[0][f"Total_{target_metric}"]
                return {
                    "executed_sql": sql,
                    "answer": f"Regional breakdown: **{top_r}** leads with **${top_v:,.2f}** in {target_metric}.",
                    "data": res_df
                }

        # 5. Top N products
        if any(term in q for term in ["top 5", "top 10", "top products", "best selling"]):
            target_metric = rev_col or prof_col
            target_dim = prod_col or cols[0]
            if target_metric and target_dim:
                sql = f'SELECT "{target_dim}", SUM("{target_metric}") AS "Total_{target_metric}" FROM dataset GROUP BY "{target_dim}" ORDER BY "Total_{target_metric}" DESC LIMIT 5'
                res_df = self.execute_sql(sql)
                return {
                    "executed_sql": sql,
                    "answer": f"Top 5 {target_dim} by {target_metric} computed.",
                    "data": res_df
                }

        # Fallback
        sql = 'SELECT * FROM dataset LIMIT 5'
        res_df = self.execute_sql(sql)
        return {
            "executed_sql": sql,
            "answer": f"Result preview for query: '{query}'.",
            "data": res_df
        }
