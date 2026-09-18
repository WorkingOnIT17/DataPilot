# DataPilot – AI Data Analyst & Recommendation Engine

![Python](https://img.shields.io/badge/Python-3.10%2B-blue)
![Streamlit](https://img.shields.io/badge/Streamlit-App-red)
![Plotly](https://img.shields.io/badge/Plotly-Interactive-purple)
![DuckDB](https://img.shields.io/badge/DuckDB-SQL%20Engine-yellow)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Milestone-40%25%20Completed-success)

---

## 🚀 Overview (40% Milestone)

**DataPilot** is an intelligent business data analysis system designed to ingest, clean, validate, analyze, visualize, and extract data-driven business insights from sales and transactional datasets.

### 🎯 40% Milestone Deliverables
1. **CSV & Excel Ingestion**: Support for `.csv`, `.xlsx`, and `.xls` files with built-in sample business datasets.
2. **Data Profiling & Quality Health**: Missing values summary, duplicates check, data types, and statistics.
3. **Automated Cleaning Pipeline**: Missing value imputation, duplicates removal, text standardization, and smart date parsing.
4. **Business Analytics & KPIs**: Revenue/Profit summaries, category/regional breakdowns, and monthly trends.
5. **Interactive Visualizations**: High-performance interactive Plotly charts (Top products, Category share, Trends, Correlation heatmaps, Distributions).
6. **Data-Driven Insights**: Automated business insights grounded in actual dataset numbers.
7. **Ask DataPilot (NL Query Box)**: Natural language question answering calculated deterministically via DuckDB/Pandas.
8. **Executive Reports**: Downloadable HTML and exportable PDF executive summaries.

---

## 🎯 Why This Project Matters

In real-world business scenarios:
- Excel and CSV files are often messy, inconsistent, and incomplete  
- Manual cleaning and validation are time-consuming and error-prone  
- Critical business trends and anomalies go unnoticed  

**DataPilot** automates the entire workflow — from raw spreadsheets to **analytics, ML-driven insights, interactive exploration, and professional reports** — making data analysis faster, reliable, and accessible for everyone.

---

## ✨ Key Features

### 🔹 Automated Data Cleaning (`src/cleaning.py`)
- Removes duplicate records  
- Handles missing values intelligently (median/mode imputation)  
- Standardizes numeric, categorical, and datetime formats  

### 🔹 Schema & Rule-Based Validation (`src/validation.py`)
- Config-driven validation using `config/config.yaml`  
- Validates expected columns, types, and allowable ranges  

### 🔹 Outlier & Anomaly Detection (`src/anomalies.py`)
- Detects numeric anomalies using **Interquartile Range (IQR)**  
- Identifies and flags potential data errors or unusual business events  

### 🔹 Business Analytics & KPIs (`src/analytics.py`)
- Computes core revenue, profit, quantity, and growth metrics  
- Aggregates performance by category, region, and time intervals  

### 🔹 Interactive & Visual Analytics (`src/visualize.py`)
- Interactive Plotly dashboards & charts  
- Correlation heatmaps, distributions, and frequency analysis charts  

### 🔹 Natural Language Query Engine (`src/query_engine.py`)
- "Ask DataPilot" conversational query interface  
- Powered by DuckDB SQL generation and Pandas fallback execution  

### 🔹 Predictive Insights & Clustering (`src/predictive.py`)
- **Linear Regression** for predictive analysis (e.g. salary / sales forecasts)  
- **Unsupervised K-Means Clustering** to segment patterns across numeric features  

### 🔹 Executive HTML & PDF Reports (`src/reporting.py`)
- Beautifully styled **HTML reports** via Jinja2 templates (`templates/report_template.html`)  
- Exportable **PDF reports** powered by `wkhtmltopdf` + `pdfkit`  

### 🔹 Streamlit Web GUI (`app_streamlit.py`)
- Intuitive, modern web application for interactive dataset exploration  
- Upload → Inspect → Clean → Query → Visualize → Download reports  

---

## 🛠️ Tech Stack

- **Language**: Python 3.10+
- **Data Processing**: Pandas, NumPy, SciPy
- **SQL / Query Engine**: DuckDB
- **Visualizations**: Plotly, Seaborn, Matplotlib
- **Machine Learning**: Scikit-learn
- **Web UI**: Streamlit
- **Reporting**: Jinja2, pdfkit, wkhtmltopdf
- **Configuration**: PyYAML, openpyxl

---

## 📂 Project Structure

```text
DataPilot/
│
├── app_streamlit.py              # Streamlit Web GUI Application
│
├── src/                          # Core application modules
│   ├── analytics.py              # Business analytics & KPI computations
│   ├── anomalies.py              # Outlier & anomaly detection (IQR)
│   ├── cleaning.py               # Data cleaning & imputation pipeline
│   ├── io_utils.py               # File I/O utilities (CSV, Excel)
│   ├── main.py                   # CLI pipeline entry point
│   ├── predictive.py             # ML models & clustering
│   ├── query_engine.py           # Natural language query engine (DuckDB)
│   ├── reporting.py              # HTML & PDF report generation
│   ├── validation.py             # Schema & rule-based validation
│   └── visualize.py              # Plotly interactive & static visualizations
│
├── config/
│   └── config.yaml               # Pipeline configuration & validation rules
│
├── install_dependencies/         # Bundled offline dependency installers
│   └── wkhtmltox-0.12.6-1.msvc2015-win64.exe  # wkhtmltopdf Windows installer for PDF exports
│
├── sample_data/                  # Built-in sample business & test datasets
│   ├── sample.xlsx
│   ├── sample_predictive.xlsx
│   ├── DataPilot_Sales_Demo.csv
│   ├── Supermarket-Sales-Sample-Data.xlsx
│   ├── Inventory-Records-Sample-Data.xlsx
│   └── ...
│
├── data/                         # Data storage
│   ├── raw/                      # Raw input datasets
│   └── processed/                # Cleaned / transformed datasets
│
├── templates/                    # Jinja2 HTML templates
│   └── report_template.html
│
├── outputs/                      # Generated figures, cleaned datasets & reports
│   ├── report.html
│   └── report.pdf
│
├── requirements.txt              # Python package dependencies
├── LICENSE                       # MIT License
└── README.md                     # Project documentation
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository & Setup Virtual Environment
```bash
# Clone the repository
git clone https://github.com/your-username/DataPilot.git
cd DataPilot

# Create and activate a virtual environment
python -m venv myenv

# On Windows:
myenv\Scripts\activate

# On macOS/Linux:
source myenv/bin/activate
```

### 2️⃣ Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 3️⃣ Install wkhtmltopdf (Required for PDF Report Generation)

To generate and export PDF executive summaries alongside HTML reports, `wkhtmltopdf` must be installed:

#### 🪟 Windows (Using Bundled Installer):
1. Locate the installer inside the `install_dependencies/` directory:
   ```text
   install_dependencies/wkhtmltox-0.12.6-1.msvc2015-win64.exe
   ```
2. Double-click or run the executable to install `wkhtmltopdf` to the default path:
   ```text
   C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe
   ```
   *(The reporting engine in `src/reporting.py` is pre-configured to detect `wkhtmltopdf` at this default location).*

#### 🐧 Linux / 🍎 macOS:
- **Ubuntu/Debian**:
  ```bash
  sudo apt-get update && sudo apt-get install -y wkhtmltopdf
  ```
- **macOS (Homebrew)**:
  ```bash
  brew install wkhtmltopdf
  ```

---

## ▶️ How to Run

### 🌐 1. Run the Streamlit Web Application (Recommended)
Launch the interactive web UI:
```bash
streamlit run app_streamlit.py
```
Open your browser at `http://localhost:8501` to upload files, clean data, query metrics, explore charts, and export reports.

### 💻 2. Run via CLI Pipeline
Run the complete end-to-end cleaning, validation, analytics, and reporting pipeline from the terminal:
```bash
# Run with sample data
python src/main.py --input sample_data/sample.xlsx --outdir outputs --config config/config.yaml

# Or using the Python module syntax:
python -m src.main --input sample_data/sample.xlsx --outdir outputs --config config/config.yaml
```

CLI Arguments:
- `--input` *(required)*: Path to the input Excel/CSV file.
- `--outdir` *(optional)*: Output directory for cleaned data, charts, and reports (defaults to `outputs`).
- `--config` *(optional)*: Path to the configuration YAML file (defaults to `config/config.yaml`).

---

## 📄 License

This project is licensed under the **MIT License**.  
See the [LICENSE](LICENSE) file for details.
