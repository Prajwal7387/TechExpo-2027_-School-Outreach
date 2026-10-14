# TechExpo 2027: School Intelligence & Outreach System

**TechExpo School Intelligence & Outreach System** is an executive-grade administrative platform purpose-built for managing and prioritizing institutional outreach across schools and junior colleges in Gujarat, India, for **TechExpo 2027**.

[![Repository](https://img.shields.io/badge/GitHub-TechExpo--2027--School--Outreach-indigo?style=flat&logo=github)](https://github.com/Prajwal7387/TechExpo-2027_-School-Outreach)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-Ready-black?style=flat&logo=vercel)](https://vercel.com)
[![Vercel KV](https://img.shields.io/badge/Database-Vercel%20KV%20%2F%20Upstash%20Redis%20(Free)-red?style=flat&logo=redis)](https://upstash.com)
[![React](https://img.shields.io/badge/React-18-blue?style=flat&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-purple?style=flat&logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com)

---

## 🚀 Key Features & Core Modules

### 1. Executive Outreach Dashboard
- **Real-Time KPI Cards:** Total schools, High-Priority targets ($\ge 75$ pts), Contacted count, Interested pipeline, Confirmed delegations, and Overdue follow-up alerts.
- **Conversion Funnel Visualization:** Visual tracking of schools progressing from *Not Contacted* $\rightarrow$ *Contacted* $\rightarrow$ *Meeting Scheduled* $\rightarrow$ *Proposal Sent* $\rightarrow$ *Interested* $\rightarrow$ *Confirmed Delegation*.
- **Gujarat Hubs Distribution:** Statewide school breakdown across key education corridors including Ahmedabad, Vadodara, Surat, Rajkot, Gandhinagar, Bhavnagar, and Anand.
- **Urgent Action Alerts:** Direct highlight cards for schools with overdue commitments, enabling 1-click calls or profile actions.

### 2. School Intelligence Directory
- **Search:** Instant fuzzy search by school name, city, principal name, or STEM coordinator.
- **Multi-Dimensional Filters:** Filter by Gujarat City, Classification Category, Priority Level (High/Medium/Low), Outreach Status, and Assigned Team Member.
- **View Modes:** Toggle between Data Table View and responsive Cards Grid View.
- **CSV Data Operations:**
  - **Export CSV:** 1-click export of filtered or full school records with contact details and scoring breakdowns.
  - **Import CSV:** Drag-and-drop CSV importer with header verification, table preview, and bulk directory insertion.
- **Record Lifecycle:** Add, Edit, Archive, and Restore institutions. Admin-level permanent deletion with confirmation dialogs.

### 3. School Classification Engine
Multi-category classification system:
- `Recent Events` (organized or participated in recent science fairs, hackathons, or robotics exhibitions)
- `Locally Famous` (prominent heritage or high-reputation board examination rankings)
- `Good to Connect With` (strong alumni networks or executive relationships)
- `Technology-Ready` (active Atal Tinkering Labs, robotics clubs, AI labs, makerspaces)
- `Untapped Opportunity` (high student potential with no prior exposure)
*(A school can belong to multiple categories simultaneously).*

### 4. 100-Point Priority Scoring Algorithm
Configurable 5-point evaluation algorithm:
1. **Recent Events:** 25 max points
2. **Reputation & Academic Standing:** 20 max points
3. **Existing Connections & Alumni:** 20 max points
4. **Technology & STEM Interest:** 20 max points
5. **Ease of Coordination & Proximity:** 15 max points
- **Total Score:** Computed out of 100 with dynamic priority badge assignment ($\ge 75$: High, $50-74$: Medium, $<50$: Low).
- **Evidence & Unknown Ratings:** Displays verified supporting evidence (e.g., ATL Tier-1 accreditation, WRO awards) and flags pending/unknown criteria contributing 0 until verified.
- **Admin Configurable Weights:** Authorized administrators can adjust weights via interactive sliders with automatic 100-point sum validation and real-time directory-wide recalculation.

### 5. Detailed School Profile
- **Institution Header:** Board affiliation (CBSE, GSEB, ICSE, IB, Cambridge), estimated student strength, address, and verified website link.
- **Leadership Hierarchy:** Principal details and STEM/ATL Coordinator direct contacts (phone, email, WhatsApp links).
- **Score Breakdown Inspector:** Visual progress meters for each criterion with evidence notes and external documentation URLs.
- **Team Assignment:** Single primary owner per school with re-assignment capability.
- **Chronological Outreach Timeline:** Complete interaction history with communication channels, notes, and scheduled follow-ups.

### 6. Outreach Management Pipeline
- **Channel Tracking:** Phone Call, Email, In-Person Visit, WhatsApp, Official Letter, LinkedIn.
- **Status Lifecycle:** Tracks responses (Positive Interest, Meeting Scheduled, Proposal Requested, Confirmed Delegation, Declined).
- **Overdue Follow-Up Engine:** Flags actions past their deadline with direct "Mark Completed" and "Reschedule" controls.
- **Interactive Activity Logging:** Modal for logging discussions, commitments, and scheduling the next follow-up.

### 7. Grounded Pitch Assistant
- **Zero Hallucination Guarantee:** Generates suggested outreach collateral strictly grounded in verified school facts (real contacts, board, city, ATL labs, awards) and approved TechExpo 2027 collateral.
- **Multi-Stakeholder Formats:**
  - Principal / Head of Institution Invitation Email
  - STEM Coordinator WhatsApp Direct Connect
  - 60-Second Phone Pitch Call Script (with objection handling)
  - Official Invitation Delegation Letter
- **Team Review & Actions:** Editable canvas with word counters, 1-click clipboard copy, TXT file export, and direct "Save as Outreach Log" button.

### 8. Team Management & Security (RBAC)
- **Role-Based Access Control:**
  - **Administrator:** Full privileges to calibrate criteria weights, invite team members, permanently delete records, and manage all school profiles.
  - **Member:** Can log outreach, generate pitches, update school data, and manage their assigned portfolio.
- **Simulated Profile Switcher:** Built-in top bar switcher for testing Admin vs. Member access permissions during development and demos.

### 9. Database & Storage Architecture
- **Dual-Engine Persistence:**
  - **Cloud Mode:** **Vercel KV / Upstash Redis** — 100% Free tier (10,000 commands/day, 256MB), natively supported by Vercel with zero credit card required. Synchronizes school data and weights across devices via REST API (`@upstash/redis`).
  - **Offline / Local Mode:** Instant fallback to browser `localStorage` when offline or when cloud credentials are not supplied.
- **JSON Backup & Restore:** 1-click export of all school records and scoring weights to timestamped JSON files.
- **Instant Reset:** Quick recovery to the 17 verified Gujarat schools at any time.

---

## 🛠️ Technology Stack

- **Frontend:** React 18 with Vite
- **Styling:** Tailwind CSS v3.4 (with PostCSS & Autoprefixer)
- **Database:** Vercel KV / Upstash Redis (100% Free Tier, Serverless REST API)
- **Client Cache & Fallback:** Browser LocalStorage Engine
- **Icons:** Lucide React (`lucide-react`)
- **Deployment Platform:** Vercel (configured via `vercel.json` with SPA routing)

---

## 📂 Project Structure

```text
TechExpo-2027_-School-Outreach/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/           # Priority Weights & Team Management Views
│   │   │   ├── common/          # Badges, ConfirmModal, Toast, DataManagementModal
│   │   │   ├── dashboard/       # Executive Dashboard with visual conversion funnel
│   │   │   ├── layout/          # Sidebar and Header components
│   │   │   ├── modals/          # Add/Edit School, Log Outreach, CSV Import Modals
│   │   │   ├── outreach/        # Outreach Pipeline & Overdue Follow-up views
│   │   │   ├── pitch/           # Grounded Pitch Assistant View
│   │   │   └── schools/         # School Directory & School Profile Views
│   │   ├── context/
│   │   │   └── AppContext.jsx   # Global state, persistence, Vercel KV cloud sync
│   │   ├── data/
│   │   │   ├── criteriaConfig.js# Default criteria weights & scoring algorithm
│   │   │   ├── sampleSchools.js # 17 curated, verified schools across Gujarat
│   │   │   └── teamMembers.js   # Team member profiles and regional hubs
│   │   ├── lib/
│   │   │   └── kvClient.js      # Vercel KV / Upstash Redis client & sync helpers
│   │   ├── App.jsx              # Application root
│   │   ├── index.css            # Tailwind directives & typography
│   │   └── main.jsx             # React DOM entry point
│   ├── .env.example             # Environment configuration template
│   ├── tailwind.config.js       # Tailwind CSS theme and color tokens
│   ├── vite.config.js           # Vite build configuration
│   ├── vercel.json              # Vercel SPA routing configuration
│   └── package.json
├── vercel.json                  # Root Vercel deployment configuration
└── README.md
```

---

## ⚡ Quick Start & Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Prajwal7387/TechExpo-2027_-School-Outreach.git
cd TechExpo-2027_-School-Outreach/frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ☁️ Deploying to Vercel with Free Vercel KV Database

### Step 1: Deploy Project on Vercel
1. Import your GitHub repository into [Vercel](https://vercel.com).
2. The project will automatically be recognized as a **Vite** project thanks to [`vercel.json`](file:///c:/Users/prajw/Desktop/Tech%20Expo/TechExpo@2027/vercel.json).
3. Click **Deploy**.

### Step 2: Attach Free Vercel KV (Upstash Redis)
1. Go to your project on the **Vercel Dashboard**.
2. Click on the **Storage** tab at the top.
3. Click **Create Database** &rarr; Select **KV (Serverless Redis by Upstash)**.
4. Select the **Hobby / Free Plan** (10,000 requests/day, 256MB — $0/month, no credit card required).
5. Click **Create**.
6. In **Project Settings** &rarr; **Environment Variables**, ensure the following variables are exposed to the frontend with the `VITE_` prefix:
   ```env
   VITE_KV_REST_API_URL=https://your-database-id.upstash.io
   VITE_KV_REST_API_TOKEN=your-upstash-rest-token
   ```
7. Redeploy on Vercel.

Your application is now fully connected to a live cloud database on Vercel, with automatic multi-device synchronization and local offline caching!

---

## 📊 Preloaded Gujarat Schools
The application includes verified intelligence across Gujarat educational hubs:
- **Ahmedabad:** Delhi Public School Bopal, Udgam School for Children, The Riverside School, St. Xavier's High School Loyola Hall, Prakash Higher Secondary, Ahmedabad International School (AIS).
- **Vadodara:** Navrachana Higher Secondary School Sama, Cygnus World School.
- **Surat:** Delhi Public School Surat, Essar International School Hazira, Fountainhead School, Tapti Valley International School.
- **Rajkot:** The Rajkumar College (RKC), SNK School, Nirmala Convent School.
- **Gandhinagar:** Kendriya Vidyalaya Sector 30, DPS Gandhinagar (Koba), Hillwoods School.
- **Bhavnagar & Anand:** Silver Bells Public School, Anandalaya NDDB Campus.

---

## 🧪 Production Build & Validation
To test and validate the production bundle:
```bash
cd frontend
npm run build
```
Built output is generated in `frontend/dist/`.
