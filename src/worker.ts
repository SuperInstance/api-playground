typescript
export interface Env {
  // No environment variables needed for this playground
}

interface Endpoint {
  id: string;
  name: string;
  method: string;
  path: string;
  description: string;
}

interface TestRequest {
  endpoint: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
}

interface TestResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  time: number;
}

interface HistoryItem {
  id: string;
  timestamp: number;
  request: TestRequest;
  response: TestResponse;
}

const ENDPOINTS: Endpoint[] = [
  { id: "users-list", name: "List Users", method: "GET", path: "/api/users", description: "Retrieve all users" },
  { id: "user-get", name: "Get User", method: "GET", path: "/api/users/{id}", description: "Retrieve specific user" },
  { id: "user-create", name: "Create User", method: "POST", path: "/api/users", description: "Create new user" },
  { id: "products-list", name: "List Products", method: "GET", path: "/api/products", description: "Retrieve all products" },
  { id: "order-create", name: "Create Order", method: "POST", path: "/api/orders", description: "Create new order" },
];

const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fleet API Playground</title>
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src *">
    <style>
        :root {
            --dark-bg: #0a0a0f;
            --dark-card: #111118;
            --dark-border: #22222f;
            --dark-text: #e0e0e0;
            --dark-text-secondary: #a0a0b0;
            --accent: #f59e0b;
            --accent-hover: #fbbf24;
            --success: #10b981;
            --error: #ef4444;
            --warning: #f59e0b;
            --info: #3b82f6;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background-color: var(--dark-bg);
            color: var(--dark-text);
            line-height: 1.6;
            min-height: 100vh;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }
        
        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 20px;
            border-bottom: 1px solid var(--dark-border);
            margin-bottom: 30px;
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .logo h1 {
            font-size: 24px;
            color: var(--accent);
        }
        
        .logo-icon {
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, var(--accent) 0%, #f97316 100%);
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: var(--dark-bg);
        }
        
        .main-layout {
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 20px;
            height: calc(100vh - 150px);
        }
        
        .sidebar {
            background: var(--dark-card);
            border-radius: 8px;
            padding: 20px;
            border: 1px solid var(--dark-border);
            overflow-y: auto;
        }
        
        .content {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .card {
            background: var(--dark-card);
            border-radius: 8px;
            padding: 20px;
            border: 1px solid var(--dark-border);
        }
        
        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid var(--dark-border);
        }
        
        .card-title {
            font-size: 18px;
            font-weight: 600;
            color: var(--accent);
        }
        
        .btn {
            padding: 8px 16px;
            background: var(--accent);
            color: var(--dark-bg);
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
            transition: background 0.2s;
        }
        
        .btn:hover {
            background: var(--accent-hover);
        }
        
        .btn-secondary {
            background: transparent;
            color: var(--accent);
            border: 1px solid var(--accent);
        }
        
        .btn-secondary:hover {
            background: rgba(245, 158, 11, 0.1);
        }
        
        .endpoint-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .endpoint-item {
            padding: 12px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 6px;
            border: 1px solid transparent;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .endpoint-item:hover {
            border-color: var(--accent);
            background: rgba(245, 158, 11, 0.05);
        }
        
        .endpoint-item.active {
            border-color: var(--accent);
            background: rgba(245, 158, 11, 0.1);
        }
        
        .endpoint-method {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            margin-right: 8px;
        }
        
        .method-get { background: #10b981; color: white; }
        .method-post { background: #3b82f6; color: white; }
        .method-put { background: #f59e0b; color: white; }
        .method-delete { background: #ef4444; color: white; }
        
        .endpoint-path {
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 14px;
            color: var(--dark-text);
        }
        
        .endpoint-desc {
            font-size: 12px;
            color: var(--dark-text-secondary);
            margin-top: 4px;
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        label {
            display: block;
            margin-bottom: 5px;
            font-size: 14px;
            font-weight: 500;
            color: var(--dark-text-secondary);
        }
        
        select, input, textarea {
            width: 100%;
            padding: 10px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--dark-border);
            border-radius: 4px;
            color: var(--dark-text);
            font-family: inherit;
        }
        
        textarea {
            min-height: 120px;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 13px;
            resize: vertical;
        }
        
        .headers-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .header-row {
            display: flex;
            gap: 10px;
        }
        
        .header-row input {
            flex: 1;
        }
        
        .response-section {
            flex: 1;
            display: flex;
            flex-direction: column;
        }
        
        .response-info {
            display: flex;
            gap: 15px;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid var(--dark-border);
        }
        
        .status-badge {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
        }
        
        .status-2xx { background: rgba(16, 185, 129, 0.2); color: #10b981; }
        .status-4xx { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
        .status-5xx { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
        
        .response-body {
            flex: 1;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 4px;
            padding: 15px;
            overflow: auto;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 13px;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        
        .history-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-height: 300px;
            overflow-y: auto;
        }
        
        .history-item {
            padding: 10px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 6px;
            border-left: 3px solid var(--accent);
            cursor: pointer;
        }
        
        .history-method {
            font-weight: 600;
            color: var(--accent);
        }
        
        .history-path {
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 12px;
            margin: 5px 0;
        }
        
        .history-time {
            font-size: 11px;
            color: var(--dark-text-secondary);
        }
        
        footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid var(--dark-border);
            text-align: center;
            color: var(--dark-text-secondary);
            font-size: 14px;
        }
        
        .footer-links {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 10px;
        }
        
        .footer-links a {
            color: var(--accent);
            text-decoration: none;
        }
        
        .footer-links a:hover {
            text-decoration: underline;
        }
        
        .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid var(--dark-border);
            border-top-color: var(--accent);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .hidden { display: none; }
        
        @media (max-width: 1024px) {
            .main-layout {
                grid-template-columns: 1fr;
                height: auto;
            }
            
            .sidebar {
                max-height: 400px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="logo">
                <div class="logo-icon">F</div>
                <h1>Fleet API Playground</h1>
            </div>
            <div>
                <button class="btn" onclick="shareRequest()">Share Request</button>
            </div>
        </header>
        
        <div class="main-layout">
            <div class="sidebar">
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">API Endpoints</div>
                    </div>
                    <div class="endpoint-list" id="endpointList"></div>
                </div>
                
                <div class="card" style="margin-top: 20px;">
                    <div class="card-header">
                        <div class="card-title">Request History</div>
                        <button class="btn btn-secondary" onclick="clearHistory()">Clear</button>
                    </div>
                    <div class="history-list" id="historyList"></div>
                </div>
            </div>
            
            <div class="content">
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">Request Builder</div>
                        <button class="btn" onclick="sendRequest()" id="sendBtn">
                            Send Request
                        </button>
                    </div>
                    
                    <div class="form-group">
                        <label for="endpointSelect">Endpoint</label>
                        <select id="endpointSelect" onchange="loadEndpoint()"></select>
                    </div>
                    
                    <div class="form-group">
                        <label for="methodSelect">HTTP Method</label>
                        <select id="methodSelect">
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                            <option value="DELETE">DELETE</option>
                            <option value="PATCH">PATCH</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="urlInput">Request URL</label>
                        <input type="text" id="urlInput" placeholder="https://api.example.com/endpoint">
                    </div>
                    
                    <div class="form-group">
                        <label>Headers</label>
                        <div class="headers-list" id="headersList">
                            <div class="header-row">
                                <input type="text" placeholder="Header name" value="Authorization">
                                <input type="text" placeholder="Header value" value="Bearer your-token-here">
                                <button class="btn btn-secondary" onclick="removeHeader(this)">Remove</button>
                            </div>
                        </div>
                        <button class="btn btn-secondary" onclick="addHeader()" style="margin-top: 10px;">Add Header</button>
                    </div>
                    
                    <div class="form-group">
                        <label for="bodyInput">Request Body (JSON)</label>
                        <textarea id="bodyInput" placeholder="{ \"key\": \"value\" }"></textarea>
                    </div>
                </div>
                
                <div class="card response-section">
                    <div class="card-header">
                        <div class="card-title">Response</div>
                    </div>
                    
                    <div class="response-info" id="responseInfo" style="display: none;">
                        <div class="status-badge" id="statusBadge">200 OK</div>
                        <div id="responseTime">Time: 0ms</div>
                        <div id="responseSize">Size: 0B</div>
                    </div>
                    
                    <div class="response-body" id="responseBody">
                        // Response will appear here
                    </div>
                </div>
            </div>
        </div>
        
        <footer>
            <div>Fleet API Playground v1.0</div>
            <div class="footer-links">
                <a href="/health">Health Check</a>
                <a href="/api/endpoints">API Endpoints</a>
                <a href="https://fleet.example.com/docs" target="_blank">Documentation</a>
                <a href="https://github.com/fleet/api" target="_blank">GitHub</a>
            </div>
        </footer>
    </div>
    
    <script>
        let endpoints = [];
        let history = JSON.parse(localStorage.getItem('fleetApiHistory') || '[]');
        let currentEndpoint = null;
        
        function init() {
            loadEndpoints();
            renderEndpoints();
            renderHistory();
            updateUrlFromEndpoint();
            
            // Load from URL hash if present
            const hash = window.location.hash.substring(1);
            if (hash) {
                try {
                    const saved = JSON.parse(atob(hash));
                    loadSavedRequest(saved);
                } catch (e) {
                    console.error('Failed to load from URL hash:', e);
                }
            }
        }
        
        async function loadEndpoints() {
            try {
                const response = await fetch('/api/endpoints');
                endpoints = await response.json();
                renderEndpoints();
            } catch (error) {
                console.error('Failed to load endpoints:', error);
                endpoints = ${JSON.stringify(ENDPOINTS)};
                renderEndpoints();
            }
        }
        
        function renderEndpoints() {
            const endpointList = document.getElementById('endpointList');
            const endpointSelect = document.getElementById('endpointSelect');
            
            endpointList.innerHTML = '';
            endpointSelect.innerHTML = '<option value="">Custom endpoint</option>';
            
            endpoints.forEach(endpoint => {
                // Add to list
                const item = document.createElement('div');
                item.className = 'endpoint-item';
                item.dataset.id = endpoint.id;
                item.innerHTML = \`
                    <div>
                        <span class="endpoint-method method-\${endpoint.method.toLowerCase()}">\${endpoint.method}</span>
                        <span class="endpoint-path">\${endpoint.path}</span>
                    </div>
                    <div class="endpoint-desc">\${endpoint.description}</div>
                \`;
                item.onclick = () => selectEndpoint(endpoint.id);
                endpointList.appendChild(item);
                
                // Add to select
                const option = document.createElement('option');
                option.value = endpoint.id;
                option.textContent = \`\${endpoint.method} \${endpoint.path} - \${endpoint.description}\`;
                endpointSelect.appendChild(option);
            });
        }
        
        function selectEndpoint(endpointId) {
            const endpoint = endpoints.find(e => e.id === endpointId);
            if (!endpoint) return;
            
            currentEndpoint = endpoint;
            
            // Update UI
            document.querySelectorAll('.endpoint-item').forEach(item => {
                item.classList.toggle('active', item.dataset.id === endpointId);
            });
            
            document.getElementById('endpointSelect').value = endpointId;
            document.getElementById('methodSelect').value = endpoint.method;
            document.getElementById('urlInput').value = endpoint.path;
            
            // Clear body for GET requests
            if (endpoint.method === 'GET') {
                document.getElementById('bodyInput').value = '';
            }
        }
        
        function loadEndpoint() {
            const endpointId = document.getElementById('endpointSelect').value;
            if (endpointId) {
                selectEndpoint(endpointId);
            } else {
                currentEndpoint = null;
                document.querySelectorAll('.endpoint-item').forEach(item => {
                    item.classList.remove('active');
                });
            }
        }
        
        function updateUrlFromEndpoint() {
            const method = document.getElementById('methodSelect').value;
            const url = document.getElementById('urlInput').value;
            
            if (currentEndpoint && currentEndpoint.method === method && currentEndpoint.path === url) {
                return;
            }
            
            currentEndpoint = null;
            document.querySelectorAll('.endpoint-item').forEach(item => {
                item.classList.remove('active');
            });
            document.getElementById('endpointSelect').value = '';
        }
        
        function addHeader() {
            const headersList = document.getElementById('headersList');
            const row = document.createElement('div');
            row.className = 'header-row';
            row.innerHTML = \`
                <input type="text" placeholder="Header name">
                <input type="text" placeholder="Header value">
                <button class="btn btn-secondary" onclick="removeHeader(this)">Remove</button>
            \`;
            headersList.appendChild(row);
        }
        
        function removeHeader(button) {
            if (document.querySelectorAll('.header-row').length > 1) {
                button.parentElement.remove();
            }
        }
        
        async function sendRequest() {
            const sendBtn = document.getElementById('sendBtn');
            const originalText = sendBtn.textContent;
            
            try {
                sendBtn.innerHTML = '<div class="loading"></div>';
                
                const method = document.getElementById('methodSelect').value;
                let url = document.getElementById('urlInput').value.trim();
                
                // Ensure URL has protocol
                if (!url.startsWith('http')) {
                    url = 'https://' + url;
                    document.getElementById('urlInput').value = url;
                }
                
                // Collect headers
                const headers = {};
                document.querySelectorAll('.header-row').forEach(row => {
                    const nameInput = row.querySelector('input[type="text"]:first-child');
                    const valueInput = row.querySelector('input[type="text"]:last-child');
                    if (nameInput.value.trim() && valueInput.value.trim()) {
                        headers[nameInput.value.trim()] = valueInput.value.trim();
                    }
                });
                
                // Prepare body
                const bodyInput = document.getElementById('bodyInput').value.trim();
                let body = null;
                if (bodyInput && method !== 'GET' && method !== 'HEAD') {
                    try {
                        body = JSON.stringify(JSON.parse(bodyInput));
                    } catch (e) {
                        showError('Invalid JSON in request body');
                        return;
                    }
                }
                
                const startTime = Date.now();
                
                const response = await fetch('/api/test', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        endpoint: url,
                        method: method,
                        headers: headers,
                        body: body
                    })
                });
                
                const responseData = await response.json();
                const endTime = Date.now();
                
                displayResponse(responseData, endTime - startTime);
                saveToHistory({
                    endpoint: url,
                    method: method,
                    headers: headers,
                    body: body
                }, responseData);
                
            } catch (error) {
                showError('Request failed: ' + error.message);
            } finally {
                sendBtn.textContent = originalText;
            }
        }
        
        function displayResponse(response, time) {
            const responseInfo =
const sh={"Content-Security-Policy":"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; frame-ancestors 'none'","X-Frame-Options":"DENY"};
export default{async fetch(r:Request){const u=new URL(r.url);if(u.pathname==='/health')return new Response(JSON.stringify({status:'ok'}),{headers:{'Content-Type':'application/json',...sh}});return new Response(html,{headers:{'Content-Type':'text/html;charset=UTF-8',...sh}});}};