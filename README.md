# 📄 MDK Resume AI — Workspace Pro

> A powerful, full-stack **AI-powered Resume Builder** with user authentication, cloud-persisted drafts, real-time preview, 6 professional templates, Gemini AI integration, ATS scoring, and a clean VS Code-inspired workspace UI — deployed on Google Cloud Run.

---

## ✨ Features at a Glance

### 🔐 User Authentication (New)
- **Sign Up / Log In** — Secure email + password registration and login
- **JWT-based sessions** — Stateless authentication tokens stored in `localStorage`
- **Bcrypt password hashing** — Passwords are never stored in plain text
- **Protected routes** — The resume workspace is only accessible after login
- **Guest mode** — Users can still try the editor without an account

### 🤖 AI Co-pilot (Opens by Default)
- **Intelligent Resume Parser** — Paste raw resume text and Gemini AI auto-fills all fields instantly
- **AI Summary Polisher** — Generates a professional 3-line summary based on your skills & experience
- **ATS Score Auditor** — Scores your resume from 0–100 with actionable keyword and clarity feedback

### 📝 Document Editor
- 9 editable resume sections with live preview:
  - Personal Details, Education, Coursework, Experience, Projects, Skills, Spoken Languages, Leadership / Achievements, Certifications
- Toggle social links on/off (LinkedIn, GitHub, Portfolio, LeetCode, GFG, Twitter, HackerRank, CodeChef)
- Profile photo upload support
- Drag-and-drop section reordering
- Per-bullet AI Polish shortcut for the Professional Summary
- Inline GitHub Repository & Live Demo links on project entries

### 🎨 Design Lab
- **6 Resume Templates:**
  | Template | Style |
  |---|---|
  | **Classic** | Traditional serif (Georgia), centered header |
  | **Modern** | Clean sans-serif layout |
  | **Professional** | Compact business format |
  | **Signature** | Header italic rule line |
  | **Executive** | Dual-column structure |
  | **Jake's (ATS)** | LaTeX-inspired single-column, ATS-optimized |
- **Accent Brand Color Picker** — Dynamically updates all headers and links across the resume
- Live preview updates instantly on every change

### 💾 Cloud-Persisted Drafts (New)
- **Saved Drafts** — Save/load multiple resume versions — synced to your account in the cloud database
- **Export JSON** — Download full workspace state as a `.json` backup
- **Import JSON** — Restore any previously exported workspace instantly
- Auto-save on every change — your data is never lost

### 🖨️ Export
- **Export PDF** — A4-optimized, print-ready PDF directly from browser
- Live word count in the toolbar
- Zoom controls (zoom in, zoom out, fit screen)

### 🌙 Theme
- Light / Dark mode toggle with persistent preference

---

## 🏗️ Architecture Overview

```
resume-builder/
│
├── index.html           # Landing page — Sign Up / Log In forms
├── home.css             # Styles for the landing / auth page
├── workspace.html       # Full resume editor SPA (UI, state, event logic)
├── style.css            # Design system — dark/light themes, VS Code-inspired layout
│
├── server.js            # Express backend — AI API, auth endpoints, drafts API
├── db_setup.js          # PostgreSQL schema setup (users + drafts tables)
├── package.json         # Node.js project config & dependencies
├── .env                 # Secrets (not committed — see .gitignore)
├── deploy_cloud_run.sh  # Google Cloud Run deployment script
│
└── templates/
    ├── utils.js         # Shared render utilities (esc, linkify, dr, buls, sh)
    ├── classic.js       # Classic serif template
    ├── modern.js        # Modern sans-serif template
    ├── professional.js  # Compact professional template
    ├── signature.js     # Signature italic template
    ├── executive.js     # Executive dual-column template
    └── jakes.js         # Jake's LaTeX-style ATS template
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML5, Vanilla CSS3, Vanilla JavaScript (ES5-compatible) |
| **Backend** | Node.js + Express 5 |
| **AI Engine** | Google Gemini API via `@google/genai` SDK |
| **AI Models** | `gemini-2.5-flash` (primary) → `gemini-2.5-flash-lite` (fallback) |
| **Database** | PostgreSQL via `pg` driver |
| **Cloud Database** | Google Cloud SQL (PostgreSQL) — `asia-south1` region |
| **DB Connector** | `@google-cloud/cloud-sql-connector` (secure IAM-based connection) |
| **Auth** | `bcryptjs` (password hashing) + `jsonwebtoken` (JWT sessions) |
| **Persistence** | Cloud SQL (logged-in users) + Browser `localStorage` (guest mode) |
| **PDF Export** | Browser native `window.print()` — A4-optimized CSS |
| **Deployment** | Google Cloud Run (fully managed, auto-scaling) |

---

## 🔐 Authentication API

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register a new user (email + name + password) |
| `POST` | `/api/auth/login` | Log in and receive a signed JWT token |

### How it works
1. On **Sign Up**, the password is hashed with `bcrypt` (salt rounds: 10) and stored in the `users` table in Cloud SQL.
2. On **Log In**, the stored hash is compared using `bcrypt.compare()`.
3. A **JWT token** is returned and stored in `localStorage` as `mdk_token`.
4. The workspace page checks for this token on load — if missing, the user is redirected back to the login page.

---

## 🤖 AI Backend — API Endpoints

All endpoints live in `server.js` on port `5000` (or `PORT` env variable on Cloud Run).

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/parse-resume` | Parses raw resume text → structured JSON for all fields |
| `POST` | `/api/generate-summary` | Generates a professional 3-line summary from skills + experience |
| `POST` | `/api/score-resume` | Returns ATS score (0–100) + detailed optimization feedback |

### 🛡️ Robust Failover & Retry Engineering

The backend uses a `generateContentWithFallback()` wrapper:

1. **Primary model** — `gemini-2.5-flash` is attempted first
2. **Automatic fallback** — If quota is exhausted (`429`) or server is overloaded (`503`), switches to `gemini-2.5-flash-lite`
3. **Exponential backoff** — Up to 2 retries with `1500ms → 3000ms` delay on the fallback model
4. **Safe JSON Parser** — `safeParseJSON()` handles markdown code blocks, unescaped newlines inside strings, and trailing commas from AI responses

---

## ☁️ Cloud Database Schema

Two tables are auto-created on first server startup via `db_setup.js`:

### `users`
| Column | Type | Description |
|---|---|---|
| `id` | SERIAL PK | Auto-increment user ID |
| `email` | VARCHAR UNIQUE | User's email address |
| `name` | VARCHAR | Display name |
| `password_hash` | VARCHAR | Bcrypt-hashed password |
| `provider` | VARCHAR | Auth provider (`local`) |
| `created_at` | TIMESTAMP | Registration timestamp |

### `drafts`
| Column | Type | Description |
|---|---|---|
| `id` | SERIAL PK | Auto-increment draft ID |
| `user_id` | INTEGER FK | References `users(id)` |
| `name` | VARCHAR | Draft label/name |
| `resume_data` | JSONB | Full resume state (S object) |
| `updated_at` | TIMESTAMP | Last modified time |

> The `UNIQUE(user_id, name)` constraint ensures a user cannot have two drafts with the same name.

---

## ⚙️ Setup & Installation (Local Development)

### Prerequisites
- Node.js v18+
- A [Google AI Studio](https://aistudio.google.com/) API key (free tier works)
- PostgreSQL running locally **OR** a Google Cloud SQL instance with `gcloud` configured

### 1. Clone the Repository
```bash
git clone https://github.com/Madhusudan04337/resume-builder.git
cd resume-builder
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create a `.env` file in the root directory:

```env
# Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# JWT
JWT_SECRET=your_jwt_secret_here

# Option A: Local PostgreSQL
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/resume_builder

# Option B: Google Cloud SQL (comment out DATABASE_URL and use these instead)
# CLOUD_SQL_CONNECTION_NAME=your-project:region:instance-name
# DB_USER=postgres
# DB_PASS=yourpassword
# DB_NAME=resume_builder
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

#### Using Google Cloud SQL locally (Option B)
```bash
# Authenticate with Application Default Credentials
gcloud auth application-default login
```
The `@google-cloud/cloud-sql-connector` will use these credentials automatically.

### 4. Start the Server
```bash
npm start
# or
node server.js
```
The server starts on **`http://localhost:5000`**. On first startup, the `users` and `drafts` tables are created automatically.

### 5. Open the App
Navigate to `http://localhost:5000` — you will see the Sign Up / Log In landing page.

---

## 🚀 Deployment — Google Cloud Run

The project includes a `deploy_cloud_run.sh` script for one-command Cloud Run deployment.

### Prerequisites
- [Google Cloud CLI](https://cloud.google.com/sdk/docs/install) installed and authenticated
- A Cloud SQL PostgreSQL instance created in your GCP project
- Cloud Run API and Cloud SQL API enabled

### Deploy
```bash
chmod +x deploy_cloud_run.sh
./deploy_cloud_run.sh
```

The script will:
1. Build and push a Docker container image to **Google Artifact Registry**
2. Deploy it to **Cloud Run** with Cloud SQL socket connection configured
3. Set all required environment variables (Gemini key, DB credentials, JWT secret)

The live app is accessible at the Cloud Run service URL provided after deployment.

---

## 🗄️ Checking Users in the Database (Google Cloud Console)

To view registered users manually:

1. Go to [Google Cloud Console → Cloud SQL](https://console.cloud.google.com/sql)
2. Select your instance → click **"Cloud SQL Studio"** (or use the **Query** tab)
3. Authenticate with your database credentials
4. Run SQL queries:

```sql
-- View all registered users
SELECT id, email, name, provider, created_at FROM users;

-- Count total users
SELECT COUNT(*) FROM users;

-- Delete a specific user
DELETE FROM users WHERE email = 'user@example.com';
```

---

## 📦 How to Use

1. **Open the app** — The **Sign Up / Log In** landing page is shown
2. **Register** with your email, name, and password (or log in if you already have an account)
3. After login, you are redirected to the **Resume Workspace**
4. The **AI Co-pilot** panel opens automatically — paste your existing resume to auto-fill all fields
5. Switch to the **Editor** tab to manually refine any section
6. Use **Design Lab** to pick a template and accent color
7. Click **"Export PDF"** in the top-right to download your resume

---

## 🧩 Resume Data Model

The app state (`S`) holds the following structure:

```js
{
  personal: { firstName, lastName, address, phone, email,
              linkedin, github, portfolio, leetcode, gfg,
              twitter, hackerrank, codechef, summary, photo },
  headline: "",
  socialEnabled: { /* per-link visibility toggles */ },
  template: "classic",          // active template key
  accentColor: "#32166f",       // CSS brand color
  education: [],                // [ { university, degree, start, end, loc } ]
  coursework: [],               // [ "Course Name", ... ]
  experience: [],               // [ { company, role, start, end, loc, bullets[] } ]
  projects: [],                 // [ { name, tech, date, github, demo, bullets[] } ]
  skills: { languages, tools, tech },
  spokenLanguages: "",
  leadership: [],               // [ { org, role, start, end, loc, bullets[] } ]
  certifications: [],           // [ { name, url, provider, start, end, skills } ]
  sectionOrder: [],             // drag-reordered section display order
  activeView: "ai",             // always opens AI Co-pilot on first load
  fileName: "my_resume",
  atsScore: null,
  atsFeedback: ""
}
```

---

## 📌 Implemented Features Checklist

- [x] User Sign Up with email + password (bcrypt hashed)
- [x] User Log In with JWT session token
- [x] Protected workspace — login required to access
- [x] Guest mode — try without account
- [x] Cloud SQL PostgreSQL database (Google Cloud)
- [x] `users` and `drafts` tables auto-initialized on startup
- [x] Dual DB mode — Cloud SQL Connector (production) / local PostgreSQL (dev)
- [x] Deployed on Google Cloud Run
- [x] AI-powered resume parsing (Gemini API)
- [x] AI summary generator
- [x] ATS score auditor (0–100 with feedback)
- [x] Model fallback with exponential backoff
- [x] 6 resume templates
- [x] Drag-and-drop section reordering
- [x] Accent color picker
- [x] Toggle social links visibility
- [x] Profile photo upload
- [x] GitHub + Live Demo links in project entries
- [x] Auto-save to localStorage (guest) / cloud drafts (logged in)
- [x] Draft save/load/delete system
- [x] JSON export and import
- [x] A4 PDF export
- [x] Dark / Light theme toggle
- [x] Zoom controls on resume preview
- [x] AI Co-pilot opens on every first page load
- [x] Word count live diagnostics

---

## 📬 Connect

- **GitHub**: [github.com/Madhusudan04337](https://github.com/Madhusudan04337)
- **LinkedIn**: [linkedin.com/in/madhu-sudan-0006a429a](https://www.linkedin.com/in/madhu-sudan-0006a429a/)
