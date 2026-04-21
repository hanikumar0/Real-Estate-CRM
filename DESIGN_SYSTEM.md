# EstateFlow Design System (v1.0)

## 🎨 1. CORE TOKENS

### Color Palette
| Token | HEX | Usage |
| :--- | :--- | :--- |
| **Primary** | `#4F46E5` | Actions, Brand, Active States |
| **Secondary** | `#0EA5E9` | Information, Secondary Links |
| **Background** | `#F8FAFC` | App-wide background |
| **Surface** | `#FFFFFF` | Cards, Modals, Navbar |
| **Danger** | `#EF4444` | Errors, Overdue, Delete actions |
| **Warning** | `#F59E0B` | Today's tasks, Expiring contracts |
| **Success** | `#10B981` | Closed deals, Revenue, Qualified status |
| **Text (Main)** | `#1E293B` | High-emphasis headings |
| **Text (Muted)** | `#64748B` | Labels, Descriptions, Footers |

### ✍️ Typography
*   **UI Font:** `Inter` (Sans-serif) - Standard interface text.
*   **Data Font:** `Manrope` (Sans-serif) - Used for prices, commission rates, and stats.

| Scale | Font Size | Weight | Usage |
| :--- | :--- | :--- | :--- |
| **H1** | 36px | 800 | Page Title (Desktop) |
| **H2** | 24px | 700 | Module Headers, Metric Values |
| **H3** | 18px | 600 | Card Titles, Section Headers |
| **Body (L)** | 16px | 400 | Main readable text |
| **Body (S)** | 14px | 500 | Tables, Form labels |
| **Caption** | 12px | 600 | Badges, Helper text |

---

## 🧩 2. COMPONENT LIBRARY

### Buttons
*   **Primary:** Solid Indigo, 8px radius. White text. Minimal box shadow on hover.
*   **Ghost:** Transparent bg, Indigo text. Border on hover. For secondary actions.
*   **Fab (Mobile):** Circular Indigo button with icon only. Fixed at bottom-right.

### Status Badges
*   **Style:** Subtle background (10% opacity) + high-contrast text.
*   `[New]` -> Gray
*   `[Qualified]` -> Blue
*   `[Negotiation]` -> Purple
*   `[Sold]` -> Emerald

### Input Fields
*   **Style:** 1px Border (#E2E8F0), 12px padding. 
*   **Focus State:** 2px Blue ring with 0.15 opacity. 

---

## 📐 3. SPACING & GRID
*   **Base Unit:** 8px.
*   **Container Padding:** 32px (Desktop), 16px (Mobile).
*   **Card Radius:** 16px (Standard), 24px (Large Containers).
