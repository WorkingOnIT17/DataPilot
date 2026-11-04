// DataPilot Backend API Client
// In development, Vite proxies '/api' to 'http://127.0.0.1:8001/api'.
// In direct/standalone mode, it falls back to 'http://localhost:8001/api'.
const API_BASE = import.meta.env.VITE_API_BASE || '/api';

async function handleResponse(res, fallbackMessage) {
  if (!res.ok) {
    let detailMsg = fallbackMessage;
    try {
      const data = await res.json();
      if (data && data.detail) {
        detailMsg = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
      }
    } catch (_) {
      try {
        const text = await res.text();
        if (text) detailMsg = text;
      } catch (_) {}
    }
    throw new Error(detailMsg);
  }
  return res.json();
}

export const api = {
  // Status & Telemetry
  async getStatus() {
    const res = await fetch(`${API_BASE}/status`);
    return handleResponse(res, 'Failed to fetch status');
  },

  // Datasets
  async getDatasets() {
    const res = await fetch(`${API_BASE}/datasets`);
    return handleResponse(res, 'Failed to fetch datasets');
  },

  async selectDataset(filename, autoCleanHeader = true) {
    const res = await fetch(`${API_BASE}/datasets/select`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, auto_clean_header: autoCleanHeader }),
    });
    return handleResponse(res, 'Failed to select dataset');
  },

  async uploadDataset(file, autoCleanHeader = true) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('auto_clean_header', String(autoCleanHeader));
    const res = await fetch(`${API_BASE}/datasets/upload`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(res, 'Failed to upload dataset');
  },

  // Analytics & Profiler
  async getAnalytics() {
    const res = await fetch(`${API_BASE}/analytics`);
    return handleResponse(res, 'Failed to fetch analytics');
  },

  // Prescriptive Recommendations
  async getRecommendations() {
    const res = await fetch(`${API_BASE}/recommendations`);
    return handleResponse(res, 'Failed to fetch recommendations');
  },

  // AI Analyst Query Flow
  async runQuery(query) {
    const res = await fetch(`${API_BASE}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    return handleResponse(res, 'Failed to run query');
  },

  // Documents & RAG
  async getDocuments() {
    const res = await fetch(`${API_BASE}/documents`);
    return handleResponse(res, 'Failed to fetch documents');
  },

  async searchDocuments(query, topK = 4) {
    const res = await fetch(`${API_BASE}/documents/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, top_k: topK }),
    });
    return handleResponse(res, 'Failed to search documents');
  },

  async uploadDocument(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/documents/upload`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(res, 'Failed to upload document');
  },

  // Ping LLM
  async pingLLM() {
    const res = await fetch(`${API_BASE}/llm/ping`, {
      method: 'POST',
    });
    return handleResponse(res, 'Failed to ping LLM');
  },

  // Export URLs
  getCleanedCsvUrl: () => `${API_BASE}/export/csv`,
  getReportHtmlUrl: () => `${API_BASE}/export/report-html`,
};
