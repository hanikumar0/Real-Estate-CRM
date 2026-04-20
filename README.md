# 🏬 EstateFlow: Production-Grade Real Estate CRM

**EstateFlow** is a high-fidelity, automation-first Real Estate CRM designed for modern agencies. It features a robust Node.js backend, a responsive Next.js frontend, and a spatial-intelligence map engine.

## 🚀 Key Features

*   **🎯 Intelligent Lead Matcher:** AI-driven scoring engine that matches buyers to properties based on budget and preferences.
*   **📊 Performance Gamification:** Real-time Agent Leaderboard with weighted productivity scoring.
*   **🗺️ Spatial Intelligence:** Integrated Leaflet map views with property geofencing and coordinate pinning.
*   **💰 Financial Pipeline:** Full Deal Kanban board with automated commission calculations and status workflows.
*   **🪝 n8n Automation:** Bi-directional webhooks for WhatsApp/Email alerts and lifecycle triggers.
*   **🛡️ Enterprise RBAC:** High-security Admin Control Center with workforce governance and user kill-switches.
*   **📈 Professional Reporting:** One-click Excel and styled PDF report generation for sales trends.

## 🛠️ Technology Stack

*   **Frontend:** Next.js 14, Tailwind CSS, Framer Motion, Lucide Icons, Recharts.
*   **Backend:** Node.js, Express, MongoDB (Mongoose), JWT Auth.
*   **Mapping:** Leaflet.js / OpenStreetMap.
*   **Automation:** n8n Workflow Engine.
*   **Testing:** Jest, Supertest, Cypress.

## 📥 Getting Started

1.  **Clone the Repo:**
    ```bash
    git clone https://github.com/hanikumar0/Real-Estate-CRM.git
    ```
2.  **Configure Environment:**
    *   Copy `.env.example` to `.env` in the root (and in /server).
    *   Fill in your MongoDB URI and n8n Webhook details.
3.  **Install Dependencies:**
    ```bash
    # Root
    npm install
    # Server
    cd server && npm install
    # Client
    cd ../client && npm install
    ```
4.  **Run Development Mode:**
    *   Server: `npm start` (on port 5000)
    *   Client: `npm run dev` (on port 3000)

## 🔌 API Documentation
Full endpoint documentation is available in [API_DOCS.md](./API_DOCS.md).

## 🧪 Testing
Full audit report and testing commands are available in [TESTING.md](./TESTING.md).

---
**Developed by Antigravity AI for Production Excellence.**
