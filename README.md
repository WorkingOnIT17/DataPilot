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
8. **Executive Reports**: Downloadable HTML/PDF executive summaries.

---

## 🎯 Why This Project Matters

In real-world datasets:
- Excel files are messy and inconsistent  
- Manual cleaning is time-consuming and error-prone  
- Insights are often delayed or missed  

**Data Sage** automates the entire workflow — from raw Excel files to **ML-driven insights and professional reports** — making data analysis faster, reliable, and accessible.

---

## ✨ Key Features

### 🔹 Automated Data Cleaning
- Removes duplicate records  
- Handles missing values intelligently  
- Standardizes numeric, categorical, and date formats  

### 🔹 Data Validation
- Rule-based validation using `config.yaml`  
- Ensures schema and column consistency  

### 🔹 Anomaly Detection
- Detects numeric outliers using **Interquartile Range (IQR)**  
- Flags potential data quality issues  

### 🔹 Visual Analytics
- Correlation matrices  
- Heatmaps  
- Feature distributions  

### 🔹 Predictive Insights
- **Linear Regression** for salary prediction  
  *(Automatically triggered if `Experience` and `Salary` columns exist)*  
- **Unsupervised Clustering** on numeric features for pattern discovery  

### 🔹 Professional Reports
- Styled **HTML reports**
- Exportable **PDF reports**
- Embedded charts, summaries, and insights  

### 🔹 Interactive GUI
- Built using **Streamlit**
- Upload → Preview → Clean → Analyze → Download  
- Designed for non-technical users  

---

## 🛠️ Tech Stack

- **Python 3.10+**
- **Pandas, NumPy** – Data processing  
- **Seaborn, Matplotlib** – Visualization  
- **Scikit-learn** – Machine Learning  
- **Streamlit** – Interactive Web UI  
- **Jinja2 + wkhtmltopdf** – Report generation  

---

## 📂 Project Structure

```text
excel-data-cleaner-bot-advanced/
│
├── src/
│   ├── cleaning.py        # Data cleaning logic
│   ├── validation.py     # Rule-based validation
│   ├── anomalies.py      # Outlier detection (IQR)
│   ├── visualize.py      # Visual analytics
│   ├── predictive.py     # ML models & clustering
│   ├── reporting.py      # HTML & PDF report generation
│   ├── io_utils.py       # File utilities
│   └── main.py           # CLI pipeline entrypoint
│
├── templates/
│   └── report_template.html
│
├── config/
│   └── config.yaml
│
├── sample_data/
│   └── sample.xlsx
│
├── outputs/
│   └── cleaned_files & reports
│
├── app.py                # Streamlit GUI
└── README.md
```

## ▶️ How to Run

### 1️⃣ Install Dependencies
```bash
pip install -r requirements.txt
```
### 2️⃣ Run the Streamlit App (Recommended)
```bash
streamlit run app.py
```
### 3️⃣ Run via CLI (Optional)
```bash
python src/main.py
```
## 📄 License

This project is licensed under the **MIT License**.  
See the [LICENSE](LICENSE.md) file for details.

## 👤 Author

**Raghav Tiwari**
- B.Tech Computer Science Engineering
- Software Engineering | Data Analytics | Machine Learning | Cloud



