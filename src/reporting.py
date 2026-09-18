from jinja2 import Environment, FileSystemLoader
import os
from datetime import datetime

def generate_report(validation, anomalies, figures, summary, insights=None, output_path="outputs/report.html"):
    print("[REPORT] Generating styled HTML report with Jinja2...")

    # Load template
    env = Environment(loader=FileSystemLoader("templates"))
    template = env.get_template("report_template.html")

    # Add metadata
    footer = {
        "generated_on": datetime.now().strftime("%d %B %Y, %I:%M %p"),
        "branding": "DataPilot – AI Data Analyst & Recommendation Engine (40% Milestone)"
    }

    # Render HTML
    html_content = template.render(
        validation=validation,
        anomalies=anomalies,
        figures=figures,
        summary=summary,
        insights=insights or {},
        footer=footer
    )

    # Ensure output folder exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # Save HTML
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"[REPORT_SAVED] HTML Report saved to {output_path}")

    # Save PDF version if wkhtmltopdf is configured
    pdf_path = output_path.replace(".html", ".pdf")
    try:
        import pdfkit
        wk_path = r"C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe"
        if os.path.exists(wk_path):
            config = pdfkit.configuration(wkhtmltopdf=wk_path)
            pdfkit.from_string(html_content, pdf_path, configuration=config)
            print(f"[PDF_SAVED] PDF Report saved to {pdf_path}")
    except Exception as e:
        print(f"[PDF_INFO] PDF report skipped: {e}")

    return output_path