# DataPilot – AI Data Analyst & Recommendation Engine

![Python](https://img.shields.io/badge/Python-3.10%2B-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-v0.162%2B-009688)
![React](https://img.shields.io/badge/React-18.3%2B-61DAFB)
![Vite](https://img.shields.io/badge/Vite-6.0%2B-646CFF)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.4-38BDF8)
![DuckDB](https://img.shields.io/badge/DuckDB-In--Memory%20SQL-yellow)
![LangGraph](https://img.shields.io/badge/LangGraph-Multi--Agent%20Orchestrator-orange)
![Streamlit](https://img.shields.io/badge/Streamlit-1.40%2B-red)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Milestone-100%25%20Completed-success)

---

## 🚀 Overview (100% Production Milestone)

**DataPilot** is a full-stack, enterprise-grade AI Data Analyst and Prescriptive Recommendation Engine. It delivers deterministic analytics with **zero mathematical hallucinations** by executing all quantitative aggregations directly in-memory via **DuckDB**, while leveraging **LangGraph multi-agent orchestration** and **generative LLMs** strictly for natural language query translation, qualitative document synthesis, and strategic storytelling.

At this **100% Milestone**, DataPilot provides two complete frontend experiences alongside an automated CLI batch engine:

1. 🌐 **Enterprise React + Tailwind Workspaces (`datapilot-frontend`)**: A modern, high-density analytics suite featuring responsive SVG dual-axis charts, live column telemetry, 1-click query suggestions, and 4 dedicated operational workspaces:
   - **Executive Analytics**: Real-time KPI scorecards, dynamic temporal trajectories, top SKU margin mix, and field-level schema profiler.
   - **AI Analyst (Multi-Agent)**: Conversational natural-language sandbox backed by a 5-step LangGraph StateGraph trace, live DuckDB SQL pass-through, and audit-locked citations.
   - **Prescriptive Strategy**: Evidence-backed recommendations flagging loss-making SKUs, revenue concentration risks, and margin erosion with an interactive policy constraint simulator.
   - **Corporate Knowledge RAG**: Ingests, indexes, and vector-searches unstructured corporate governance PDFs, DOCX memos, and TXT policy documents.
2. ⚡ **High-Throughput Asynchronous Backend (`api_server.py`)**: FastAPI REST service on port `8001` providing reactive data ingestion, deterministic KPI computation, real-time telemetry, and file export endpoints.
3. 📊 **Interactive Streamlit Web GUI (`app_streamlit.py`)**: A 5-tab application running on port `8501` for quick tabular exploration, interactive Plotly visualizations, and PDF report downloads.
4. 💻 **Automated CLI Batch Pipeline (`src/main.py`)**: Headless pipeline that ingests raw datasets, strips header banners, validates schemas, detects anomalies, and compiles executive HTML/PDF briefs.

---

## 🎯 100% Milestone Deliverables & Architecture

| Phase / Component | Status | Verified Capabilities |
|---|---|---|
| **Phase 0: Audit & Architecture** | ✅ Verified (100%) | Baseline capabilities audited; clean boundaries established across `src/`, `config/`, and UI targets. |
| **Phase 1: Analytics Foundation** | ✅ Verified (100%) | Smart header auto-detection, resilient date cleaning, YAML schema validation, and deterministic KPI math in `src/analytics.py`. |
| **Phase 2: Natural Language Analytics** | ✅ Verified (100%) | DuckDB SQL translation in `src/query_engine.py` supporting date filters, min/max, rankings, dimensional breakdowns, and direct SQL pass-through. |
| **Phase 3: Business Document RAG** | ✅ Verified (100%) | `src/document_rag.py` ingests `.pdf` (`pypdf`), `.docx` (`python-docx`), `.txt`, and `.md` with chunking and TF-IDF cosine similarity search. |
| **Phase 4: Hybrid Query Engine** | ✅ Verified (100%) | `src/hybrid_engine.py` classifies intent (`data_only`, `document_only`, `hybrid`, `conversational`) to synthesize quantitative metrics with qualitative corporate policies. |
| **Phase 5: LangGraph Multi-Agent Orchestration** | ✅ Verified (100%) | `src/orchestrator.py` implements a `StateGraph` workflow featuring intent routing, SQL execution, mathematical verification guardrails, and automated retry loops. |
| **Phase 6: Prescriptive Recommendations** | ✅ Verified (100%) | `src/recommendations.py` automatically detects loss-making SKUs, discount margin erosion, customer concentration (>35%), and regional performance gaps. |
| **Phase 7: Full Application Integration** | ✅ Verified (100%) | 5-tab `app_streamlit.py` and Jinja2 executive report generation (`templates/report_template.html` and `src/reporting.py`) with KPI summary boxes and wkhtmltopdf export. |
| **Phase 8: Automated Regression Suite** | ✅ Verified (100%) | 26/26 automated unit, integration, and UI tests in `tests/` passing with a 100% success rate. |
| **FastAPI Backend Server** | ✅ Verified (100%) | `api_server.py` on port `8001` handling reactive dataset uploads, telemetry, vectorized queries, and CORS proxy routing. |
| **Enterprise React Frontend** | ✅ Verified (100%) | `datapilot-frontend` built with React 18, Vite 6, and Tailwind CSS. Features 4 interactive workspaces and dynamic SVG charts. |
| **Multi-Provider LLM Intelligence** | ✅ Verified (100%) | `src/llm_client.py` unified client supporting Google Gemini (`gemini-2.5-flash`), OpenAI (`gpt-4o-mini`), and local Ollama (`llama3.2`) with candidate cascade and zero-hallucination fallback. |

---

## ✨ Key System Features

### 1. 🛡️ Strict Zero-Hallucination Design
- All quantitative statistics, KPIs, and analytical numbers are computed deterministically by **DuckDB** or **Pandas** on the actual uploaded dataset.
- LLMs are used strictly for **natural language translation** and **conversational synthesis**, citing verified figures directly from the database.

### 2. 🤖 LangGraph Multi-Agent Orchestrator (`src/orchestrator.py`)
- Coordinates the complete query lifecycle across 5 distinct execution stages:
  1. **Intent Classification**: Classifies question as quantitative data, policy document, or hybrid.
  2. **SQL Generation**: Generates schema-aligned DuckDB SQL.
  3. **Schema Guardrails**: Validates read-only AST execution and verifies column existence.
  4. **Policy Grounding**: Retrieves relevant excerpts with exact source citations and relevance scores.
  5. **Hybrid Synthesis**: Combines database results with policy context.
- **Self-Correcting Execution**: Automatically triggers retry loops if an anomaly or execution issue occurs.

### 3. 📈 Reactive Business Visualizations
- **Dual-Axis Trajectory**: Real monthly/batch revenue bars plotted against gross margin % curves with automated anomaly markers on outlier periods.
- **Ranked SKU Mix**: Top catalog items sorted by financial contribution and margin strength.
- **Dimensional Shares**: Proportional segment breakdowns for instant category analysis.
- **Pearson Correlation Matrix**: Pairwise correlation coefficients identifying interconnected financial drivers.
- **Field-Level Schema Profiler**: Row count, null percentage, cardinality, mean, spread (IQR), and Z-score outlier status per column.

### 4. 🎯 Evidence-Backed Prescriptive Recommendation Engine (`src/recommendations.py`)
- Automatically assesses:
  - **Loss-Making SKUs**: Identifies products generating negative profit despite sales volume.
  - **Revenue Concentration Risk**: Flags single categories or segments contributing >35% of total revenue.
  - **Discount Margin Erosion**: Detects aggressive discounting strategies eroding EBITDA.
  - **Policy Simulator**: Interactive constraint modeling for target margin floors and product delisting.

---

## 📂 Project Structure

```text
DataPilot/
├── start_app.ps1                 # One-click launcher for Backend API + React Frontend
├── api_server.py                 # FastAPI REST API Backend (port 8001)
├── app_streamlit.py              # Streamlit Web GUI Application (port 8501)
├── requirements.txt              # Core Python dependencies
├── .env.example                  # Environment configuration template
├── .gitignore                    # Comprehensive Git exclusion rules
│
├── datapilot-frontend/           # Enterprise React + Vite + Tailwind Frontend
│   ├── package.json              # Frontend package configuration
│   ├── vite.config.js            # Vite build configuration & API reverse proxy
│   ├── tailwind.config.js        # Design token configuration
│   └── src/
│       ├── api.js                # Asynchronous API client for backend communication
│       ├── App.jsx               # Root application coordinator & state container
│       └── components/
│           ├── Header.jsx                # Top telemetry bar & dataset breadcrumbs
│           ├── Sidebar.jsx               # Navigation workspaces & dataset ingestion
│           ├── ExecutiveAnalytics.jsx    # Real-time KPIs, SVG charts, and schema profiler
│           ├── AIAnalyst.jsx             # Conversational multi-agent sandbox & SQL view
│           ├── PrescriptiveStrategy.jsx  # Prescriptive recommendations & margin simulator
│           └── CorporateKnowledge.jsx    # Document RAG viewer, semantic search, and uploads
│
├── src/                          # Core analytical and algorithmic modules
│   ├── analytics.py              # Column role inference, KPI calculators & chart aggregations
│   ├── anomalies.py              # Z-score statistical outlier detection
│   ├── cleaning.py               # Automated cleaning, imputation & resilient date parsing
│   ├── document_rag.py           # Document parser (PDF/DOCX/TXT/MD) & TF-IDF semantic search
│   ├── hybrid_engine.py          # Unified hybrid routing & multi-source synthesis
│   ├── io_utils.py               # Smart tabular ingestion (CSV/Excel header auto-detection)
│   ├── llm_client.py             # Multi-provider LLM client (Gemini, OpenAI, Ollama)
│   ├── main.py                   # Terminal CLI batch pipeline entry point
│   ├── orchestrator.py           # LangGraph StateGraph multi-agent orchestrator
│   ├── predictive.py             # ML models (Linear Regression, KMeans clustering)
│   ├── query_engine.py           # DuckDB natural language query engine & SQL translator
│   ├── recommendations.py        # Prescriptive business recommendation engine
│   ├── reporting.py              # Executive HTML & PDF report generation (wkhtmltopdf)
│   ├── validation.py             # Schema & rule-based validation
│   └── visualize.py              # Plotly interactive dashboards & static figures
│
├── config/
│   └── config.yaml               # Pipeline configuration & schema validation rules
│
├── sample_data/                  # Built-in demonstration datasets
│   ├── Enterprise_SaaS_Revenue_2023_2024.csv    # 750 SaaS subscriber accounts & churn scores
│   ├── Global_Retail_Omnichannel_Sales.csv      # 1,000 retail transactions & profit margins
│   ├── Healthcare_Pharma_Supply_Chain.csv       # 650 pharmaceutical batches & defect audits
│   ├── DataPilot_Sales_Demo.csv                 # E-commerce transactional demo
│   └── sample.xlsx                              # Baseline workbook sample
│
├── sample_documents/             # Business strategy memos & governance policies for RAG
│   ├── FY2023_Corporate_Strategy_Review.txt
│   ├── Sales_Discount_and_Pricing_Policy.txt
│   ├── SaaS_Enterprise_Expansion_Memo_2024.txt
│   └── Pharma_Quality_and_Compliance_Guideline.txt
│
├── templates/
│   └── report_template.html      # Jinja2 executive HTML report template
│
├── tests/                        # Automated test suite (26 passing tests)
│   ├── test_analytics.py
│   ├── test_anomalies.py
│   ├── test_app_ui.py
│   ├── test_cleaning.py
│   ├── test_document_rag.py
│   ├── test_hybrid_engine.py
│   ├── test_io_utils.py
│   ├── test_llm_client.py
│   ├── test_orchestrator.py
│   ├── test_pipeline_cli.py
│   ├── test_query_engine.py
│   ├── test_recommendations.py
│   └── test_validation.py
│
└── install_dependencies/
    └── wkhtmltox-0.12.6-1.msvc2015-win64.exe  # Bundled Windows installer for wkhtmltopdf
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository & Setup Virtual Environment
```powershell
# Clone the repository
git clone https://github.com/your-username/DataPilot.git
cd DataPilot

# Create and activate virtual environment
python -m venv myenv
myenv\Scripts\activate
```

### 2️⃣ Install Python Dependencies
```powershell
pip install -r requirements.txt
```

### 3️⃣ Install Frontend Dependencies
```powershell
cd datapilot-frontend
npm install
cd ..
```

### 4️⃣ Configure Environment Variables (Optional for LLM Intelligence)
Copy the template file `.env.example` to `.env`:
```powershell
copy .env.example .env
```
Add your preferred API key in `.env`:
```env
# Google Gemini API Key (https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_key_here

# OpenAI API Key (https://platform.openai.com/api-keys)
OPENAI_API_KEY=your_openai_key_here

# Local Ollama endpoint (default)
OLLAMA_BASE_URL=http://localhost:11434/v1
```
*Note: If no API key is provided, DataPilot runs automatically on its high-speed deterministic DuckDB engine with zero configuration required.*

### 5️⃣ Install wkhtmltopdf (For PDF Report Exports)
1. Run the bundled installer located in `install_dependencies/wkhtmltox-0.12.6-1.msvc2015-win64.exe`.
2. Install to the default directory (`C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe`).

---

## ▶️ How to Run

### 🌐 1. Enterprise React Web Application (Recommended)

#### Option A: One-Click Launcher (PowerShell)
```powershell
.\start_app.ps1
```
This automatically starts both the **FastAPI backend** (port `8001`) and the **React frontend** (port `5173`).

#### Option B: Separate Terminals
- **Terminal 1 (Backend API):**
  ```powershell
  myenv\Scripts\python.exe api_server.py
  ```
- **Terminal 2 (Frontend Dev Server):**
  ```powershell
  cd datapilot-frontend
  npm run dev
  ```
Open **`http://localhost:5173`** in your browser.

---

### 📊 2. Streamlit Web GUI
```powershell
myenv\Scripts\streamlit.exe run app_streamlit.py
```
Open **`http://localhost:8501`** in your browser to interact with the 5-tab dashboard.

---

### 💻 3. Batch CLI Pipeline
Execute the complete end-to-end cleaning, validation, analytics, and reporting pipeline from the terminal:
```powershell
myenv\Scripts\python.exe src/main.py --input sample_data/Enterprise_SaaS_Revenue_2023_2024.csv --outdir outputs --config config/config.yaml
```

CLI Arguments:
- `--input` *(required)*: Path to input CSV or Excel workbook.
- `--outdir` *(optional)*: Output directory for cleaned CSVs, figures, and reports (defaults to `outputs`).
- `--config` *(optional)*: Path to YAML configuration (defaults to `config/config.yaml`).

---

## 🧪 Automated Testing

DataPilot includes an automated test suite verifying data cleaning, RAG semantic search, LangGraph multi-agent orchestration, DuckDB SQL execution, and UI rendering:

```powershell
myenv\Scripts\python.exe -m pytest -v
```

**Test Status**: **26/26 passed (100% pass rate)** in under 20 seconds.

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
