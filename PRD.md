# Product Requirement Document: EstateFlow CRM (Final MVP)

## 1. Product Vision
To provide real estate agents with a centralized command center that ensures **zero missed follow-ups** and faster deal closures by eliminating spreadsheet-based tracking and fragmenting lead data.

---

## 2. MVP Scope (Phase 1)
The MVP focuses on the absolute minimum path to value: capturing a lead, tracking interactions, and moving them toward a sale.

### ✅ Included in MVP
*   **Lead Management:** Manual entry + Website contact form API.
*   **Follow-up System:** Mandatory `followUpDate` and status tracking.
*   **Simplified Deal Tracking:** List view with stage-based dropdowns.
*   **Property Registry:** Simple internal database of available units.
*   **Immutable Notes System:** Timestamped logs that cannot be edited or deleted.
*   **Strict RBAC:** Agents can only see data assigned to them.

---

## 3. User Roles & Business Rules

### User Roles
| Role | Permissions |
| :--- | :--- |
| **Admin** | Full access to all data. Can assign/reassign leads and monitor all agent performance. |
| **Agent** | **Strict Access:** Can only view, edit, or log notes for leads and deals assigned to them. Can view all properties. |

### 🛠️ Core Business Rules
*   **Single-Deal Constraint:** One Lead can have only **ONE** active Deal at a time.
*   **Assignment Lock:** Only **Admin** users can assign or reassign leads to agents.
*   **Privacy:** Agents cannot search for or view leads assigned to other agents.
*   **Property Ownership:** Properties can be edited **only** by Admins or the User who created the listing.

---

## 4. Feature Breakdown (MVP)

### Lead Module
*   **Fields:** Name, Phone, Email, Budget, `followUpDate`, `status`, `source`, `createdById`.
*   **Status Workflow:** New → Contacted → Qualified → Closed/Lost.
*   **Interaction History:** A list of immutable notes.

### Property Module
*   **Fields:** Title, Location, Price, Size, `status`, `createdBy`.
*   **States:** Available, Under Contract, Sold.

### Deal Module (Simplified)
*   **Stages:** Negotiation, Under Contract, Sold.
*   **Audit Fields:** `createdAt`, `updatedAt`.

---

## 5. Functional & Validation Requirements

### 🛡️ Validation Rules
*   **Lead Identity:** `name` and `phone` are mandatory fields.
*   **Status Integrity:** `status` must be selected from a predefined Enum.
*   **Follow-up Bridge:** `followUpDate` becomes **required** immediately after the first contact log is saved.
*   **Qualification Gate:** A Deal **cannot** be created unless the Lead's status is "Qualified."

### ⚙️ Functional Requirements
*   **FR-1: Lead Capture API:** Endpoint to accept JSON lead data.
*   **FR-2: Assignment Logic:** Admin-only UI to link Lead to Agent.
*   **FR-3: Access Filtering:** Backend must enforce `assignedToId` filters on all queries.
*   **FR-4: Overdue Tracking:** System must tag leads as **"Overdue"** if `followUpDate` ≤ current date.
*   **FR-5: Audit Trail:** Notes must be timestamped and locked upon creation.

---

## 6. Core Data Model

### Lead Entity
- `id` (UUID)
- `name`, `phone`, `email`, `budget` (Mandatory)
- `status` (Enum)
- `source` (Enum: website, manual, referral, ads)
- `followUpDate` (Timestamp)
- `assignedToId` (FK -> User)
- `createdById` (FK -> User)

### Property Entity
- `id` (UUID)
- `title`, `address`, `price`, `description`
- `status` (Enum: available, under_contract, sold)
- `images` (List of URLs)
- `createdBy` (FK -> User)

### Deal Entity
- `id` (UUID)
- `leadId` (FK -> Lead)
- `propertyId` (FK -> Property)
- `stage` (Enum)
- `salePrice`, `commissionRate`
- `createdAt`, `updatedAt` (Timestamp)

### Note Entity (NEW)
- `id` (UUID)
- `leadId` (FK -> Lead)
- `content` (Text)
- `createdBy` (FK -> User)
- `createdAt` (Timestamp)
- *Constraint: Immutable (No Edit/Delete).*

---

## 7. Light API Definitions (Core Endpoints)
1. **POST `/api/leads`**: Create new lead (Supports manual entry and web-form).
2. **PATCH `/api/leads/:id/assign`**: Admin-only endpoint to assign lead to Agent.
3. **PATCH `/api/leads/:id/status`**: Update lead status and trigger validation.
4. **POST `/api/notes`**: Create a timestamped, immutable note for a lead.
5. **POST `/api/deals`**: Convert a Qualified Lead into an active Deal.

---

## 8. Dashboard & Follow-up Logic
*   **Overdue Alert:** If `followUpDate` is in the past, the Lead row must be highlighted in Red.
*   **Lead Counter:** Dashboard should show "Total Leads," "Active Deals," and "Overdue Follow-ups" prominently.

---

## 9. Tech Stack
*   **Frontend:** React (Vite) + Tailwind + Shadcn/UI.
*   **Backend:** Node.js (Express) + JWT-based Authentication.
*   **Database:** PostgreSQL.
*   **Storage:** Cloudinary.

---

## 10. Success Criteria
*   **Performance:** API response < 500ms.
*   **Adoption:** Dashboard shows 0 overdue leads at end-of-day.

---

## 11. Risks & Constraints
*   **Scaling:** Poor DB indexing on `assignedToId` could slow down searches as lead volume grows.
