export interface Env {
  PLAYGROUND_HISTORY: KVNamespace;
}

interface Endpoint {
  id: string;
  name: string;
  method: string;
  path: string;
  description: string;
}

interface HistoryItem {
  id: string;
  timestamp: number;
  method: string;
  url: string;
  status: number;
  duration: number;
}

const ENDPOINTS: Endpoint[] = [
  { id: "1", name: "Get Users", method: "GET", path: "/api/users", description: "Retrieve list of users" },
  { id: "2", name: "Create User", method: "POST", path: "/api/users", description: "Create a new user" },
  { id: "3", name: "Get Orders", method: "GET", path: "/api/orders", description: "Retrieve user orders" },
  { id: "4", name: "Health Check", method: "GET", path: "/health", description: "Service health status" },
];

const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API Playground | Fleet</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --dark: #0a0a0f;
      --darker: #050508;
      --light: #f8fafc;
      --accent: #f59e0b;
      --accent-dark: #d97706;
      --gray: #334155;
      --gray-light: #64748b;
      --border: #1e293b;
      --success: #10b981;
      --error: #ef4444;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', sans-serif;
      background: var(--dark);
      color: var(--light);
      min-height: 100vh;
      line-height: 1.6;
    }
    
    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    header {
      background: var(--darker);
      border-bottom: 1px solid var(--border);
      padding: 1.5rem 0;
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .logo-icon {
      width: 32px;
      height: 32px;
      background: var(--accent);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: var(--dark);
    }
    
    .logo-text {
      font-size: 1.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, var(--accent), #fbbf24);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .hero {
      text-align: center;
      padding: 4rem 0 3rem;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .hero h1 {
      font-size: 3.5rem;
      font-weight: 800;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, var(--light), #cbd5e1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .hero p {
      font-size: 1.25rem;
      color: var(--gray-light);
      margin-bottom: 2rem;
    }
    
    .app {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 4rem;
    }
    
    @media (max-width: 1024px) {
      .app {
        grid-template-columns: 1fr;
      }
    }
    
    .panel {
      background: var(--darker);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
    }
    
    .panel-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .panel-title {
      font-size: 1.125rem;
      font-weight: 600;
    }
    
    .panel-content {
      padding: 1.5rem;
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
      color: var(--gray-light);
    }
    
    select, input, textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      background: var(--dark);
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--light);
      font-family: 'Inter', sans-serif;
      font-size: 0.9375rem;
      transition: border-color 0.2s;
    }
    
    select:focus, input:focus, textarea:focus {
      outline: none;
      border-color: var(--accent);
    }
    
    .method-select {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    
    .method-btn {
      padding: 0.5rem 1rem;
      background: var(--dark);
      border: 1px solid var(--border);
      border-radius: 6px;
      color: var(--light);
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .method-btn:hover {
      background: var(--gray);
    }
    
    .method-btn.active {
      background: var(--accent);
      color: var(--dark);
      border-color: var(--accent);
    }
    
    .btn {
      padding: 0.75rem 1.5rem;
      background: var(--accent);
      color: var(--dark);
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .btn:hover {
      background: var(--accent-dark);
    }
    
    .btn-secondary {
      background: var(--gray);
      color: var(--light);
    }
    
    .btn-secondary:hover {
      background: var(--gray-light);
    }
    
    .btn-icon {
      width: 20px;
      height: 20px;
    }
    
    .response-container {
      height: 400px;
      overflow: auto;
    }
    
    .response-status {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }
    
    .status-success {
      background: rgba(16, 185, 129, 0.1);
      color: var(--success);
    }
    
    .status-error {
      background: rgba(239, 68, 68, 0.1);
      color: var(--error);
    }
    
    pre {
      background: var(--dark);
      padding: 1rem;
      border-radius: 8px;
      overflow: auto;
      font-size: 0.875rem;
      line-height: 1.5;
    }
    
    .history-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .history-item {
      background: var(--dark);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 1rem;
      cursor: pointer;
      transition: border-color 0.2s;
    }
    
    .history-item:hover {
      border-color: var(--accent);
    }
    
    .history-method {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: var(--accent);
      color: var(--dark);
      border-radius: 4px;
      font-weight: 600;
      font-size: 0.75rem;
      margin-right: 0.75rem;
    }
    
    .history-url {
      font-family: monospace;
      font-size: 0.875rem;
      color: var(--light);
    }
    
    .history-status {
      float: right;
      font-weight: 600;
    }
    
    .footer {
      background: var(--darker);
      border-top: 1px solid var(--border);
      padding: 3rem 0;
      margin-top: 4rem;
    }
    
    .footer-content {
      text-align: center;
    }
    
    .footer-logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--accent);
      margin-bottom: 1rem;
    }
    
    .footer-text {
      color: var(--gray-light);
      max-width: 600px;
      margin: 0 auto 2rem;
    }
    
    .loading {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 2px solid var(--gray-light);
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .hidden {
      display: none;
    }
    
    .notification {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      padding: 1rem 1.5rem;
      background: var(--success);
      color: var(--dark);
      border-radius: 8px;
      font-weight: 600;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
      z-index: 1000;
      animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  </style>
</head>
<body>
  <header>
    <div class="container header-content">
      <div class="logo">
        <div class="logo-icon">API</div>
        <div class="logo-text">Playground</div>
      </div>
      <div>
        <button class="btn btn-secondary" onclick="loadHistory()">
          <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          History
        </button>
      </div>
    </div>
  </header>
  
  <main class="container">
    <div class="hero">
      <h1>API Playground</h1>
      <p>Interactive playground for testing Fleet endpoints. Build requests, inspect responses, and share your tests.</p>
    </div>
    
    <div class="app">
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title">Request Builder</div>
          <div>
            <button class="btn" onclick="sendRequest()" id="send-btn">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
              Send Request
            </button>
            <div class="loading hidden" id="loading"></div>
          </div>
        </div>
        <div class="panel-content">
          <div class="form-group">
            <label for="endpoint-select">Select Endpoint</label>
            <select id="endpoint-select" onchange="onEndpointChange()">
              <option value="">Custom request</option>
            </select>
          </div>
          
          <div class="method-select">
            <button class="method-btn active" data-method="GET">GET</button>
            <button class="method-btn" data-method="POST">POST</button>
            <button class="method-btn" data-method="PUT">PUT</button>
            <button class="method-btn" data-method="DELETE">DELETE</button>
            <button class="method-btn" data-method="PATCH">PATCH</button>
          </div>
          
          <div class="form-group">
            <label for="url">URL</label>
            <input type="text" id="url" placeholder="https://api.example.com/endpoint" value="">
          </div>
          
          <div class="form-group">
            <label for="auth-header">Authorization Header</label>
            <input type="text" id="auth-header" placeholder="Bearer token_here">
          </div>
          
          <div class="form-group">
            <label for="request-body">Request Body (JSON)</label>
            <textarea id="request-body" rows="8" placeholder="{ \"key\": \"value\" }"></textarea>
          </div>
          
          <div class="form-group">
            <label for="headers">Additional Headers (JSON)</label>
            <textarea id="headers" rows="4" placeholder="{ \"Content-Type\": \"application/json\" }">{ "Content-Type": "application/json" }</textarea>
          </div>
        </div>
      </div>
      
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title">Response Viewer</div>
          <button class="btn btn-secondary" onclick="copyResponse()">
            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            Copy
          </button>
        </div>
        <div class="panel-content">
          <div id="response-status" class="response-status hidden"></div>
          <div class="response-container">
            <pre id="response-body">Response will appear here...</pre>
          </div>
        </div>
      </div>
    </div>
    
    <div class="panel">
      <div class="panel-header">
        <div class="panel-title">Request History</div>
        <button class="btn btn-secondary" onclick="clearHistory()">Clear History</button>
      </div>
      <div class="panel-content">
        <div class="history-list" id="history-list">
          <div class="history-item">
            <span class="history-method">GET</span>
            <span class="history-url">/api/endpoints</span>
            <span class="history-status status-success">200</span>
          </div>
        </div>
      </div>
    </div>
  </main>
  
  <footer class="footer">
    <div class="container footer-content">
      <div class="footer-logo">Fleet API</div>
      <p class="footer-text">API Playground is part of the Fleet ecosystem. Build, test, and deploy with confidence.</p>
      <p class="footer-text">© 2024 Fleet API. All rights reserved.</p>
    </div>
  </footer>
  
  <div id="notification" class="notification hidden"></div>
  
  <script>
    let currentMethod = 'GET';
    let endpoints = [];
    
    document.addEventListener('DOMContentLoaded', async () => {
      loadEndpoints();
      loadHistory();
      setupMethodButtons();
      
      document.getElementById('url').value = window.location.origin + '/api/endpoints';
    });
    
    function setupMethodButtons() {
      document.querySelectorAll('.method-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.method-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentMethod = btn.dataset.method;
        });
      });
    }
    
    async function loadEndpoints() {
      try {
        const response = await fetch('/api/endpoints');
        endpoints = await response.json();
        const select = document.getElementById('endpoint-select');
        select.innerHTML = '<option value="">Custom request</option>';
        endpoints.forEach(endpoint => {
          const option = document.createElement('option');
          option.value = endpoint.id;
          option.textContent = endpoint.name + ' (' + endpoint.method + ' ' + endpoint.path + ')';
          select.appendChild(option);
        });
      } catch (error) {
        console.error('Failed to load endpoints:', error);
      }
    }
    
    function onEndpointChange() {
      const select = document.getElementById('endpoint-select');
      const selectedId = select.value;
      const endpoint = endpoints.find(e => e.id === selectedId);
      
      if (endpoint) {
        currentMethod = endpoint.method;
        document.querySelectorAll('.method-btn').forEach(btn => {
          btn.classList.toggle('active', btn.dataset.method === endpoint.method);
        });
        document.getElementById('url').value = window.location.origin + endpoint.path;
      }
    }
    
    async function sendRequest() {
      const url = document.getElementById('url').value;
      const authHeader = document.getElementById('auth-header').value;
      const requestBody = document.getElementById('request-body').value;
      const headersText = document.getElementById('headers').value;
      
      if (!url) {
        showNotification('Please enter a URL', 'error');
        return;
      }
      
      const sendBtn = document.getElementById('send-btn');
      const loading = document.getElementById('loading');
      sendBtn.classList.add('hidden');
      loading.classList.remove('hidden');
      
      const startTime = Date.now();
      
      try {
        const headers = {};
        if (authHeader) {
          headers['Authorization'] = authHeader;
        }
        
        try {
          const additionalHeaders = JSON.parse(headersText);
          Object.assign(headers, additionalHeaders);
        } catch (e) {
          console.warn('Invalid headers JSON, using default');
          headers['Content-Type'] = 'application/json';
        }
        
        const options = {
          method: currentMethod,
          headers: headers
        };
        
        if (requestBody && ['POST', 'PUT', 'PATCH'].includes(currentMethod)) {
          try {
            JSON.parse(requestBody);
            options.body = requestBody;
          } catch (e) {
            showNotification('Invalid JSON in request body', 'error');
            return;
          }
        }
        
        const response = await fetch('/api/test', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            url: url,
            method: currentMethod,
            headers: headers,
            body: requestBody
          })
        });
        
        const duration = Date.now() - startTime;
        const result = await response.json();
        
        displayResponse(result, duration);
        saveToHistory(url, currentMethod, result.status, duration);
        loadHistory();
        
      } catch (error) {
        displayResponse({
          status: 0,
          body: 'Request failed: ' + error.message,
          headers: {}
        }, Date.now() - startTime);
      } finally {
        sendBtn.classList.remove('hidden');
        loading.classList.add('hidden');
      }
    }
    
    function displayResponse(result, duration) {
      const statusEl = document.getElementById('response-status');
      const bodyEl = document.getElementById('response-body');
      
      statusEl.classList.remove('hidden');
      statusEl.textContent = result.status + ' • ' + duration + 'ms';
      statusEl.className = 'response-status ' + (result.status >= 200 && result.status < 300 ? 'status-success' : 'status-error');
      
      try {
        const parsedBody = typeof result.body === 'string' ? JSON.parse(result.body) : result.body;
        bodyEl.textContent = JSON.stringify(parsedBody, null, 2);
      } catch {
        bodyEl.textContent = result.body;
      }
    }
    
    async function saveToHistory(url, method, status, duration) {
      try {
        await fetch('/api/history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            url: url,
            method: method,
            status: status,
            duration: duration
          })
        });
      } catch (error) {
        console.error('Failed to save history:', error);
      }
    }
    
    async function loadHistory() {
      try {
        const response = await fetch('/api/history');
        const history = await response.json();
        const listEl = document.getElementById('history-list');
        
        listEl.innerHTML = '';
        
        history.forEach(item => {
          const itemEl = document.createElement('div');
          itemEl.className = 'history-item';
          itemEl.onclick = ()
const sh = {"Content-Security-Policy":"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; frame-ancestors 'none'","X-Frame-Options":"DENY"};
export default { async fetch(r: Request) { const u = new URL(r.url); if (u.pathname==='/health') return new Response(JSON.stringify({status:'ok'}),{headers:{'Content-Type':'application/json',...sh}}); return new Response(html,{headers:{'Content-Type':'text/html;charset=UTF-8',...sh}}); }};