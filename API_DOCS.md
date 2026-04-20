# 🔌 EstateFlow CRM: API Documentation (v1)

This document provides a comprehensive technical overview of the EstateFlow REST API. All endpoints are protected by JWT and RBAC unless otherwise specified.

**Base URL:** `http://localhost:5000/api`  
**Internal Secret Header:** `X-Webhook-Secret` (for n8n integrations)

---

## 🔐 1. Authentication Module

### POST `/auth/login`
**Description:** Authenticate agent and receive session token.  
**Payload:**
```json
{ "email": "agent@estateflow.com", "password": "password" }
```
**Response:** `200 OK` + `{ token, user: { id, name, role } }`

---

## 🎯 2. Lead Management

### GET `/leads`
**Description:** List leads. Managers see all; Agents see assigned only.  
**Response:** Array of Lead Objects.

### GET `/leads/:id/matches`
**Description:** **AI Matcher.** Returns top properties scored for this lead.  
**Response:** `[{ ...property, matchScore: 95 }, ...]`

### POST `/leads`
**Description:** Create lead (Manual/Website).  
**Payload:**
```json
{ 
  "name": "Jane Doe", 
  "email": "jane@example.com", 
  "budget": 750000, 
  "preferences": { "propertyType": "RESIDENTIAL" } 
}
```

---

## 🏠 3. Property Inventory

### GET `/properties`
**Description:** Fetch available listings. Includes Map coordinates.  
**Query Params:** `?type=RESIDENTIAL&minPrice=100000`

### GET `/properties/:id/matches`
**Description:** **Reverse Matcher.** Find potential buyers for this property.

### POST `/properties` (Multipart/FormData)
**Description:** Create listing with images.  
**Fields:** `title`, `price`, `type`, `location`, `images` (File array).

---

## 💰 4. Deal Pipeline

### GET `/deals`
**Description:** Returns the active Kanban board data.

### PATCH `/deals/:id/stage`
**Description:** Update deal progress.  
**Payload:** `{ "stage": "CLOSED" }`  
**Effect:** Automates commission calculation & updates Agent Leaderboard.

---

## 📊 5. Analytics & Performance

### GET `/analytics/dashboard`
**Description:** Fetch KPI snapshots (Revenue, Deals, Leads).

### GET `/analytics/leaderboard`
**Description:** Fetch the Top 10 Agent rankings by weighted score.

---

## 🪝 6. Webhook Outbound (Automation)

The CRM pushes events to the `N8N_WEBHOOK_URL` configured in `.env`.

**Event Structure:**
```json
{
  "source": "ESTATEFLOW_CRM",
  "event": "DEAL_CLOSED | LEAD_CREATED | AGENT_RANK_PROMOTED",
  "timestamp": "ISO-DATE",
  "payload": { ...eventDetails }
}
```

---

## 🛡️ 7. Security & Headers

1.  **Authorize:** Set header `Authorization: Bearer <YOUR_TOKEN>`
2.  **Privacy:** Passwords and sensitive PII are stripped from listing/analytics APIs.
3.  **Role Levels:**
    *   `ADMIN`: Full Access.
    *   `MANAGER`: Full Analytics + Global Exports.
    *   `AGENT`: Access to assigned Leads and shared Properties only.
