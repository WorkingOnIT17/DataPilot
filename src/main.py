import os
import argparse
import yaml
import pandas as pd
from src import cleaning, validation, anomalies, visualize, reporting, predictive


def load_config(config_path: str):
    with open(config_path, "r") as f:
        return yaml.safe_load(f)


def run_pipeline(input_file: str, output_dir: str, config_path: str):
    os.makedirs(output_dir, exist_ok=True)

    # Load config
    config = load_config(config_path)

    # Load data
    df = pd.read_excel(input_file)
    print(f"📥 Loading file: {input_file}")
    print(f"✅ Loaded {df.shape[0]} rows and {df.shape[1]} columns")

    # --- Cleaning ---
    df_clean = cleaning.clean_data(df, config)
    cleaned_file = os.path.join(output_dir, "cleaned.xlsx")
    df_clean.to_excel(cleaned_file, index=False)

    # --- Validation ---
    validation_issues = validation.validate_data(df_clean, config.get("validation", []))

    # --- Anomalies ---
    anomalies_found = anomalies.detect_anomalies(df_clean)

    # --- Visualizations ---
    figures = visualize.generate_visuals(df_clean, output_dir)  # ✅ Pass output_dir here

        # --- Predictive Insights ---
    insights = predictive.run_predictive_models(df_clean)

    # --- Summary for Report ---
    summary = {
        "Original Rows": df.shape[0],
        "Original Columns": df.shape[1],
        "Cleaned Rows": df_clean.shape[0],
        "Columns After Cleaning": df_clean.shape[1],
        "Validation Issues Found": sum(len(v) for v in validation_issues.values()),
        "Columns With Issues": len(validation_issues),
        "Anomalies Detected": len(anomalies_found),
        "Output File": os.path.basename(cleaned_file),
    }

    # --- Report ---
    report_file = os.path.join(output_dir, "report.html")
    reporting.generate_report(validation_issues, anomalies_found, figures, summary, insights, report_file)



def main():
    parser = argparse.ArgumentParser(description="Excel Data Cleaner Bot")
    parser.add_argument("--input", required=True, help="Path to input Excel file")
    parser.add_argument("--outdir", default="outputs", help="Output directory")
    parser.add_argument("--config", default="config/config.yaml", help="Path to config.yaml")

    args = parser.parse_args()
    run_pipeline(args.input, args.outdir, args.config)


if __name__ == "__main__":
    main()
