// DataPilot Backend API Client
const API_BASE = 'http://localhost:8001/api';

export const api = {
  // Status & Telemetry
  async getStatus() {
    const res = await fetch(`${API_BASE}/status`);
    if (!res.ok) throw new Error('Failed to fetch status');
    return res.json();
  },

  // Datasets
  async getDatasets() {
    const res = await fetch(`${API_BASE}/datasets`);
    if (!res.ok) throw new Error('Failed to fetch datasets');
    return res.json();
  },

  async selectDataset(filename, autoCleanHeader = true) {
    const res = await fetch(`${API_BASE}/datasets/select`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, auto_clean_header: autoCleanHeader }),
    });
    if (!res.ok) throw new Error('Failed to select dataset');
    return res.json();
  },

  async uploadDataset(file, autoCleanHeader = true) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('auto_clean_header', autoCleanHeader);
    const res = await fetch(`${API_BASE}/datasets/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to upload dataset');
    return res.json();
  },

  // Analytics & Profiler
  async getAnalytics() {
    const res = await fetch(`${API_BASE}/analytics`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  // Prescriptive Recommendations
  async getRecommendations() {
    const res = await fetch(`${API_BASE}/recommendations`);
    if (!res.ok) throw new Error('Failed to fetch recommendations');
    return res.json();
  },

  // AI Analyst Query Flow
  async runQuery(query) {
    const res = await fetch(`${API_BASE}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) throw new Error('Failed to run query');
    return res.json();
  },

  // Documents & RAG
  async getDocuments() {
    const res = await fetch(`${API_BASE}/documents`);
    if (!res.ok) throw new Error('Failed to fetch documents');
    return res.json();
  },

  async searchDocuments(query, topK = 4) {
    const res = await fetch(`${API_BASE}/documents/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, top_k: topK }),
    });
    if (!res.ok) throw new Error('Failed to search documents');
    return res.json();
  },

  async uploadDocument(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/documents/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to upload document');
    return res.json();
  },

  // Ping LLM
  async pingLLM() {
    const res = await fetch(`${API_BASE}/llm/ping`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to ping LLM');
    return res.json();
  },

  // Export URLs
  getCleanedCsvUrl: () => `${API_BASE}/export/csv`,
  getReportHtmlUrl: () => `${API_BASE}/export/report-html`,
};

