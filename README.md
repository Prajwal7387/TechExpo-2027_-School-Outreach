# TechExpo 2027: School Intelligence & Outreach System

**TechExpo School Intelligence & Outreach System** is an executive-grade, full-stack administrative platform purpose-built for managing and prioritizing institutional outreach across schools and junior colleges in Gujarat, India, for **TechExpo 2027**.

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

---

## 🛠️ Technology Stack

- **Frontend:** React 18 with Vite
- **Styling:** Tailwind CSS v3.4 (with PostCSS & Autoprefixer)
- **Database:** Supabase PostgreSQL with Row Level Security (RLS)
- **Authentication:** Supabase Auth (with offline fallback and interactive demo persistence)
- **Icons:** Lucide React (`lucide-react`)

---

## 📂 Project Structure

```text
TechExpo@2027/
├── backend/
│   └── supabase/
│       ├── schema.sql           # PostgreSQL table definitions, RLS policies, & triggers
│       └── seed.sql             # Default scoring weights & official pitch collateral
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/           # Priority Weights & Team Management Views
│   │   │   ├── common/          # Badges, ConfirmModal, Toast, SupabaseStatusModal
│   │   │   ├── dashboard/       # Executive Dashboard with visual conversion funnel
│   │   │   ├── layout/          # Sidebar and Header components
│   │   │   ├── modals/          # Add/Edit School, Log Outreach, CSV Import Modals
│   │   │   ├── outreach/        # Outreach Pipeline & Overdue Follow-up views
│   │   │   ├── pitch/           # Grounded Pitch Assistant View
│   │   │   └── schools/         # School Directory & School Profile Views
│   │   ├── context/
│   │   │   └── AppContext.jsx   # Global state, persistence, calculation engine
│   │   ├── data/
│   │   │   ├── criteriaConfig.js# Default criteria weights & scoring algorithm
│   │   │   ├── sampleSchools.js # 20 curated schools across Gujarat
│   │   │   └── teamMembers.js   # Team member profiles and regional hubs
│   │   ├── lib/
│   │   │   └── supabaseClient.js# Supabase client initializer & config validator
│   │   ├── App.jsx              # Application root
│   │   ├── index.css            # Tailwind directives & typography
│   │   └── main.jsx             # React DOM entry point
│   ├── .env.example             # Supabase environment variables template
│   ├── tailwind.config.js       # Tailwind CSS theme and color tokens
│   ├── vite.config.js           # Vite build configuration
│   └── package.json
└── README.md
```

---

## ⚡ Quick Start & Setup Instructions

### 1. Prerequisites
- **Node.js:** v18.x or later
- **npm:** v10.x or later

### 2. Installation
Navigate into the `frontend` directory and install dependencies:
```bash
cd frontend
npm install
```

### 3. Running Locally (Interactive Demo Mode)
The application works immediately out-of-the-box with 20 realistic Gujarat school profiles, interactive CSV tools, live score recalculation, and LocalStorage persistence:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗄️ Supabase PostgreSQL Configuration

To link your live Supabase database and authentication backend:

### Step 1: Create a Supabase Project
1. Log in to [Supabase](https://supabase.com) and create a new project.
2. Go to the **SQL Editor** in the Supabase dashboard.

### Step 2: Apply Database Schema & Policies
Copy and execute the entire contents of:
[`backend/supabase/schema.sql`](file:///c:/Users/prajw/Desktop/Tech%20Expo/TechExpo@2027/backend/supabase/schema.sql)

This script automatically sets up:
- Tables: `schools`, `profiles`, `scoring_criteria_weights`, `outreach_logs`, and `pitch_templates`.
- Row Level Security (RLS) policies protecting school contacts and restricting weight updates to administrators.
- Triggers for updating timestamps and registering profiles upon auth sign-up.

Next, execute [`backend/supabase/seed.sql`](file:///c:/Users/prajw/Desktop/Tech%20Expo/TechExpo@2027/backend/supabase/seed.sql) to populate initial scoring criteria weights and approved pitch collateral.

### Step 3: Set Environment Variables
In `frontend/`:
```bash
cp .env.example .env
```
Edit `frontend/.env` with your project URL and public Anon Key:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> **Security Note:** Never expose your Supabase `service_role` secret key in the frontend repository or `.env` file. Only the public `anon` key is permitted.

---

## 📊 Sample Preloaded Gujarat Schools
The application includes realistic sample data across Gujarat educational hubs:
- **Ahmedabad:** Delhi Public School Bopal, Udgam School for Children, The Riverside School, St. Xavier's High School Loyola Hall, Prakash Higher Secondary, Ahmedabad International School (AIS).
- **Vadodara:** Navrachana Higher Secondary School Sama, Cygnus World School.
- **Surat:** Delhi Public School Surat, Essar International School Hazira, Fountainhead School, Tapti Valley International School.
- **Rajkot:** The Rajkumar College (RKC), SNK School, Nirmala Convent School.
- **Gandhinagar:** Kendriya Vidyalaya Sector 30, DPS Gandhinagar (Koba), Hillwoods School.
- **Bhavnagar & Anand:** Silver Bells Public School, Anandalaya NDDB Campus.

---

## 🧪 Production Build
To validate the production bundle:
```bash
cd frontend
npm run build
```
Built output is generated in `frontend/dist/`.
