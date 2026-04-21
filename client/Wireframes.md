# UI/UX Wireframes: EstateFlow CRM (Final Specification)

## Global UX Patterns
*   **Empty States:** Clear "No [Items] found" message with a primary action button (e.g., "Add Lead").
*   **Loading States:** Skeletons for table rows and cards; spinners for button submission.
*   **Search Behavior:** Global Search uses **Debounced Input (300ms)** to prevent excessive API calls.
*   **Color Logic (Follow-ups):**
    *   🔴 **Red:** Overdue (Date < Today).
    *   🟡 **Yellow:** Today (Date = Today).
    *   ⚪ **Neutral:** Upcoming (Date > Today).

---

## 1. Login Page
*   **Layout:** Centered login card.
*   **UX Polish:** Auto-focus on Email field; "Forgot Password" link (Phase 2).
*   **Fields:**
    *   `Email` (Red border on validation error)
    *   `Password` (Toggle "Show Password" eye icon)

---

## 2. Dashboard (Final Refined)
1.  **Updated Layout:** 3-column metrics + **New "Today's Follow-ups" Widget**.
2.  **New Components:**
    *   **Today's Follow-ups Widget:** Mid-size card showing a list of names/phone numbers where `followUpDate` = Today.
3.  **Actions:** 
    *   Click "Call" icon next to any name in the "Today" widget to initiate a call directly.
4.  **UX Improvements:** Summary icons for Metrics (Person icon for Leads, Dollar for Deals, Alarm for Overdue).

---

## 3. Lead List Page
1.  **Updated Layout:** Desktop Table / **Mobile Card List**.
2.  **New/Improved Components:**
    *   **Desktop Quick Actions:** "Call" icon and "Status" dropdown directly in the table row.
    *   **Mobile Lead Card:** 
        *   Row 1: Name + Status Badge.
        *   Row 2: Follow-up Date (Color coded).
        *   Row 3: Primary "Call" Button (Blue) + "View" Button (Outline).
3.  **User Actions Added:** Instant status update without leaving the list page.
4.  **UX Summary:** Table-to-Card conversion ensures the agent can work effectively while in the field.

---

## 4. Lead Detail Page (Refined)
1.  **Updated Layout:** Added **"Assign Agent" (Admin Only)** and **"Deal Creation Modal"**.
2.  **New/Improved Components:**
    *   **Admin Assignment Dropdown:** Top-right dropdown visible only to Admin roles.
    *   **Expandable Add Note:** Textarea that expands on focus; includes "Save Note" button.
    *   **Timeline Note Item:** Shows `Agent Name` and `Timestamp` (e.g., "John Doe • 2h ago").
    *   **Deal Creation Modal:** Triggered via "Create Deal" button.
3.  **Modal Fields:**
    *   `Property` (Dropdown, Filtered to "Available")
    *   `Sale Price` (Number, Required)
    *   `Commission %` (Number, Defaults to 3%)
4.  **UX Improvements:** "Create Deal" button is disabled unless Lead Status is "Qualified."

---

## 5. Add Lead Form (Refined)
1.  **Updated Layout:** Single column with validation hints.
2.  **Fields Updated:**
    *   `name` (Marked with `*` Red asterisk)
    *   `phone` (Marked with `*` Red asterisk + Validation hint: "Missing numbers")
    *   `followUpDate` (Added to form with DatePicker, default to "Today + 1")
    *   `source` (Dropdown: Website, Manual, etc.)
3.  **UX Improvements:** Multi-step indicator (Optional) or clear section headers for "Contact Info" and "Preferences."

---

## 6. Property List Page (Refined)
1.  **Components:**
    *   **Edit Button:** Pencil icon on each property card/row.
    *   **Status Badges:** Color-coded (Available: Green, Under Contract: Orange, Sold: Grey).
2.  **User Actions:** Click Edit -> Opens Edit Form (reuses Add Property UI with pre-filled data).

---

## 7. Deal List Page
1.  **Layout:** Professional ledger style.
2.  **Components:**
    *   **Stage Dropdown:** Update stage inline (Negotiation -> Under Contract -> Sold).
3.  **UX Summary:** Focus on financial clarity; total projected commission visible in header.

---

## 8. Mobile UX Adaptation Summary
*   **Navigation:** Bottom tab bar for Leads, Assets, and Dashboard.
*   **Input:** Large touch targets (min 44px) for all buttons and dropdowns.
*   **Feedback:** Toast notifications for specific events (e.g., "Note saved!", "Deal Created!").
