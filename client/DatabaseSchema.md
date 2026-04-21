# Database Schema: EstateFlow CRM (Final Production-Ready)

## A. MONGOOSE MODELS

### 1. User Model
```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true }, // Index: Unique email
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'agent'], default: 'agent', required: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
```

### 2. Lead Model
```javascript
const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true }, // Recommendation: Normalize to E.164 format before save
  email: { type: String },
  budget: { type: Number },
  status: { 
    type: String, 
    enum: ['new', 'contacted', 'qualified', 'closed', 'lost'], 
    default: 'new',
    required: true 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  source: { 
    type: String, 
    enum: ['website', 'manual', 'referral', 'ads'], 
    default: 'manual' 
  },
  followUpDate: { type: Date },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Standardized field name
  archived: { type: Boolean, default: false } // Soft-delete support
}, { timestamps: true });

// Production Indexes
leadSchema.index({ assignedTo: 1, archived: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ followUpDate: 1 });

const Lead = mongoose.model('Lead', leadSchema);
```

### 3. Property Model
```javascript
const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  address: { type: String, required: true },
  price: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['available', 'under_contract', 'sold'], 
    default: 'available',
    required: true 
  },
  images: [{ type: String }], // Recommendation: App limit max 10 images
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  archived: { type: Boolean, default: false }
}, { timestamps: true });

// Listing Performance Indexes
propertySchema.index({ status: 1 });
propertySchema.index({ price: 1 });

const Property = mongoose.model('Property', propertySchema);
```

### 4. Deal Model
```javascript
const dealSchema = new mongoose.Schema({
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  stage: { 
    type: String, 
    enum: ['negotiation', 'under_contract', 'sold'], 
    default: 'negotiation',
    required: true 
  },
  salePrice: { type: Number, required: true },
  commissionRate: { type: Number, default: 3 },
  commissionAmount: { type: Number } // Calculated as (salePrice * commissionRate / 100)
}, { timestamps: true });

// [BUSINESS RULE]: Deal can ONLY be created if lead.status === "qualified"
// [BUSINESS RULE]: One active deal per lead (Partial Index logic)
dealSchema.index(
  { leadId: 1 }, 
  { unique: true, partialFilterExpression: { stage: { $ne: 'sold' } } }
);

const Deal = mongoose.model('Deal', dealSchema);
```

### 5. Note Model
```javascript
const noteSchema = new mongoose.Schema({
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  content: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { 
  timestamps: { createdAt: true, updatedAt: false } // Notes are immutable; only track creation
});

// [BUSINESS RULE]: Notes must not be updated or deleted (Enforced at API level)
const Note = mongoose.model('Note', noteSchema);
```

---

## B. CHANGE SUMMARY
1.  **Field Standardization:** All `createdById` references migrated to `createdBy`.
2.  **Archiving:** Introduced `archived: Boolean` to Leads and Properties for soft-delete support.
3.  **Indexing:** Confirmed User Email unique index and added Listing filters for Property status/price.
4.  **Feature Additions:** Added Lead `priority` and Deal `commissionAmount`.
5.  **Documentation:** Added inline business rules for API-level enforcement (Lead Qualification and Note Immutability).
6.  **Formatting:** Recommended normalization for `phone` and limits for property `images`.
