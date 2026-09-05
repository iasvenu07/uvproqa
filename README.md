# SDET & QA Automation Portfolio | Venugopal Ummadisetty

A premium, interactive developer portfolio and orchestration control center designed for **Venugopal Ummadisetty**, specializing in Software Development Engineer in Test (SDET) and QA Automation engineering. Styled with a high-contrast, immersive dark-terminal theme.

Live Development App: [Access Live Preview](https://ais-dev-j6gecmjqtgjte723zm6low-822345439645.asia-east1.run.app)

---

## 🛠 Key Application Modules

### 1. CI/CD Execution Matrix (Activity Heatmap)
An authentic GitHub-style contribution heatmap visualizing **365 days of continuous integration and test automation runs**.
* **Micro-State Tooltips**: Hover over active squares to audit precise execution dates, pipeline types, pass/fail status, and completion durations.
* **Filter System**: Categorically isolate and examine **Smoke**, **Regression**, **API**, or **All** automated pipeline sweeps.
* **Live Consistency Metrics**: Showcases real-time KPIs including total yearly test runs and an automated consistency index.

### 2. Live QA Pipeline Sandbox
A terminal-themed workspace representing an active command-line sandbox (`qa-pipeline-sandbox.py`).
* **Interactive Command Parser**: Accepts manual typing of developer utilities (`help`, `clear`, `pytest`, `metrics`, `cloud-scan`, `api-inspect`).
* **Automated Macros**: Built-in micro-triggers to compile and invoke test sweeps, scan cloud access-control policies, and diagnostic AI routines with live state printouts.

### 3. Admin Control & Telemetry Panel
A secure, multi-tier orchestration center featuring strict simulated IAM role gates.
* **Role-Based Access Controls (RBAC)**: Switch between **Guest**, **Lead**, and **Admin** profiles. Custom security gates deny raw audit access to non-admins with interactive elevation prompts.
* **Real-time Telemetry Streams**: Monitor CPU, RAM, API gateway latencies, and WebSocket connection loads powered by periodic polling.
* **Historical Audit Logs**: Track active security events, user-invoked actions, simulation IP tracking, and transaction schemas.

### 4. Interactive AI Twin Recruiter Chat
An AI-assisted conversation terminal built to act as Venugopal’s autonomous representation.
* **Intelligent Querying**: Answers questions about testing experience, pipeline methodologies, test-bed designs, and recruitment status.
* **Quick-Suggestion Pills**: One-click action prompts (`"View Tech Stack"`, `"Automation Experience"`, `"Contact Information"`) to expedite recruiter workflow.

### 5. Cryptographically Secured Contact Gateway
A customized contact and project-scope submission form.
* **Transaction Logging**: Successful submissions auto-generate a secure cryptographic **Transaction Lead Ref ID** stored securely within the audit leads telemetry pipeline.
* **Form Validation Guard**: Built-in structural error handlers for phone formats, required inputs, and email structures.

---

## 💻 Tech Stack

* **Front-end Library**: React 18 with Vite
* **Programming Language**: TypeScript (Strict type safety)
* **Animation & Interactions**: Framer Motion (`motion/react`)
* **Icons**: Lucide React
* **Styling & Theme**: Tailwind CSS (Sophisticated matte neutral shades, blurred backdrops, and custom monospaced layout elements)
* **Backend Framework**: Node.js & Express (Robust server-side routing for telemetry metrics and audit data)

---

## 🚀 Getting Started (Local Development)

To run this application locally, ensure you have **Node.js** installed on your system.

### 1. Clone the Repository & Install Dependencies
```bash
# Clone this repository
git clone <repository-url>
cd <repository-folder>

# Install packages using npm
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory based on the `.env.example` structure:
```env
# Server Ingress Port (Default is 3000)
PORT=3000
```

### 3. Start Development Server
Run the unified front-end and back-end development environments:
```bash
npm run dev
```
Once initialized, open `http://localhost:3000` in your web browser.

### 4. Build for Production
To bundle assets and transpile code for production deployment:
```bash
# Build both the React static outputs and bundled Node server
npm run build

# Start the compiled production app
npm run start
```

---

## 🔒 Security & Compliance Standards
This application implements strict design guidelines, preventing the display of unsanitized inputs, ensuring correct frame permission allocations, and sanitizing unhandled exceptions to maximize local development environment stability.
