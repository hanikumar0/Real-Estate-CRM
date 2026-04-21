# UI/UX Specification & Wireframe Structure

## 🏠 1. DASHBOARD UX (The Mission Control)
*   **Top Row:** 4 KPI Cards: Total Revenue (Green), Active Deals (Blue), Qualified Leads (Purple), Follow-ups Due (Red).
*   **Main Grid (2 Columns):**
    *   **Left (Narrow):** Quick Actions (Add Lead, Add Property) + Recent Activity Feed.
    *   **Right (Wide):** "Priority Follow-ups" Table. Shows Name, Score, and Urgency Indicator.
*   **Mobile View:** Stacked 2x2 grid for stats, followed by a vertical list of follow-ups.

## 👤 2. LEAD MODULE UX
*   **List View:** 
    *   **Desktop:** Scrollable table with sticky "Name" column. Status is a dropdown to allow fast pipeline movement.
    *   **Mobile:** 2-column cards. Top row is Name + Status badge. Bottom row is Budget + "Call Now" Primary Action.
*   **Interaction:** Clicking a row opens the detail page with a "Side Sheet" animation (Fast Contextual View).

## 💰 3. DEAL PIPELINE UX
*   **Visual Strategy:** Linear progress bar at the top representing `Negotiation -> Contract -> Sold`.
*   **Commission Tracker:** Prominent card showing "Potential Revenue" for active deals.
*   **Linking:** Clicking a property name in the deal list opens a quick-preview of the property details without leaving the deal module.

---

## 🔄 4. USER FLOWS

### Flow: Lead Conversion to Deal
1. **Agent** updates Lead status to "Qualified" in Lead Detail.
2. **System** unlocks "Convert to Deal" button.
3. **Agent** clicks button -> Modal opens requesting: Property ID, Sale Price, Commission %.
4. **Agent** saves -> Redirected to Deal Detail.
5. **System** creates "Log Entry" in lead activity timeline automatically.

---

## 📱 5. MOBILE ADAPTATION RULES
1. **Tables:** Always convert to cards at `< 768px`.
2. **Sidebar:** Collapse into a "Bottom Navigation Bar" on mobile for thumb-friendly reach.
3. **Modals:** Convert to "Bottom Sheets" for easier input selection.
4. **Hover:** Replace with Long-press for tooltips.

---

## ⚡ 6. PERFORMANCE RULES
1. **LCP (Largest Contentful Paint):** Priority fetch for top 4 Dashboard stats.
2. **Feedback:** Every button click must show a loading state (Pulse/Spinner) within 150ms.
3. **Optimistic UI:** When a lead status is changed, update the UI immediately while the API syncs in the background.
