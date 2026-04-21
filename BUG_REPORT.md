# System Bug Report: EstateFlow CRM MVP

## BUG ID: BR-001
*   **Module:** Auth (Security)
*   **Severity:** **CRITICAL**
*   **Description:** Privilege Escalation via Registration.
*   **Steps to Reproduce:**
    1. Send a POST request to `/api/auth/register`.
    2. Provide a payload including `"role": "admin"`.
    3. The system creates the user with full Admin privileges.
*   **Expected Result:** The registration endpoint should ignore or restrict the `role` field, defaulting to `agent` or requiring an Admin token to set roles.
*   **Actual Result:** Any user can gain Admin access at will.

---

## BUG ID: BR-002
*   **Module:** Deal (Business Logic)
*   **Severity:** **HIGH**
*   **Description:** API Crash on Deal Creation due to Enum Mismatch.
*   **Steps to Reproduce:**
    1. Qualify a lead.
    2. Create a deal linked to that lead.
    3. `dealService.js` attempts to set `lead.status = 'in_deal'`.
*   **Expected Result:** Lead status is updated to indicate an active transaction.
*   **Actual Result:** Mongoose throws a `ValidationError` because `'in_deal'` is not part of the `Lead` status enum, causing a 400/500 error.

---

## BUG ID: BR-003
*   **Module:** Deal (Data Integrity)
*   **Severity:** **HIGH**
*   **Description:** Stale `commissionAmount` on Update.
*   **Steps to Reproduce:**
    1. Create a deal with Sale Price $100k (Commission: $3k).
    2. Update the deal's `salePrice` to $200k via the Update Deal API.
*   **Expected Result:** `commissionAmount` recalculates to $6k.
*   **Actual Result:** Because `findByIdAndUpdate` is used, the `pre('save')` hook is bypassed. The commission remains $3k while the sale price is $200k.

---

## BUG ID: BR-004
*   **Module:** Property (Validation)
*   **Severity:** **MEDIUM**
*   **Description:** Unenforced Image Upload Limit.
*   **Steps to Reproduce:**
    1. Send a PUT/POST request to `/api/properties`.
    2. Send an array of 50 image URLs.
*   **Expected Result:** System rejects the request (Max 10 images per PRD).
*   **Actual Result:** Request is accepted, leading to bloat in database documents and potential frontend performance lag.

---

## BUG ID: BR-005
*   **Module:** Auth (UX/Validation)
*   **Severity:** **LOW**
*   **Description:** Missing Email Normalization.
*   **Steps to Reproduce:**
    1. Register with `TEST@EXAMPLE.COM`.
    2. Attempt to login with `test@example.com`.
*   **Expected Result:** Successful login (Emails are case-insensitive).
*   **Actual Result:** Login fails because the registration didn't normalize the case, and MongoDB unique indexes are case-sensitive.

---

## BUG ID: BR-006
*   **Module:** Lead (Persistence)
*   **Severity:** **MEDIUM**
*   **Description:** Stale Soft Delete Visibility in Queries.
*   **Steps to Reproduce:**
    1. Get a Lead by ID (`/api/leads/:id`).
    2. Delete the lead (archived = true).
    3. Perform a GET request for the specific ID again.
*   **Expected Result:** 404 Not Found (or excluded).
*   **Actual Result:** `getLeadById` logic in `leadService.js` checks `archived: false`, which is good, but `updateLead` doesn't check it, allowing accidental updates to "deleted" leads.
