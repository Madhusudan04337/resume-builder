# 📄 MDK Resume AI — Workspace Pro

> A powerful **AI-powered Resume Builder** with real-time preview, 4 professional templates, Gemini AI integration, ATS scoring, and a clean VS Code-inspired workspace UI — runs entirely on your local machine.

---

## ✨ Features at a Glance

### 🤖 AI Co-pilot (Opens by Default)
- **Intelligent Resume Parser** — Paste raw resume text and Gemini AI auto-fills all fields instantly
- **AI Summary Polisher** — Generates a professional 3-line summary based on your skills & experience
- **ATS Score Auditor** — Scores your resume from 0–100 with actionable keyword and clarity feedback
- **Automatic Model Fallback** — Switches from `gemini-2.5-flash` → `gemini-2.5-flash-lite` with exponential backoff if quota is exceeded

### 📝 Document Editor
- 9 editable resume sections with live A4 preview:
  - Personal Details, Education, Coursework, Experience, Projects, Skills, Spoken Languages, Leadership / Achievements, Certifications
- Toggle social links on/off (LinkedIn, GitHub, Portfolio, LeetCode, GFG, Twitter, HackerRank, CodeChef)
- Profile photo upload support
- Drag-and-drop section reordering
- Per-bullet AI Polish shortcut for the Professional Summary
- Inline GitHub Repository & Live Demo links on project entries

### 🎨 Design Lab
- **4 Resume Templates:**

  | Template | Style |
  |---|---|
  | **Classic** | Traditional serif (Georgia), centered header |
  | **Executive** | Dual-column compact structure |
  | **Jake's (ATS)** | LaTeX-inspired single-column, ATS-optimized |
  | **Sabrina** | Elegant luxury gold serif layout |
  | **Elizabeth** | Minimalist modern boxed header |

- **Accent Brand Color Picker** — Dynamically updates all headers and links across the resume
- Live preview updates instantly on every change

### 💾 Local Drafts
- **Save Drafts** — Save and load multiple resume versions in browser `localStorage`
- **Export JSON** — Download full workspace state as a `.json` backup
- **Import JSON** — Restore any previously exported workspace instantly
- Auto-save on every change — your data is never lost between sessions

### 🖨️ Export
- **Export PDF** — A4-optimized, print-ready PDF directly from the browser
- Live word count in the toolbar
- Zoom controls (zoom in, zoom out, fit screen)

### 🌙 Theme
- Light / Dark mode toggle with persistent preference

---

## 🏗️ Project Structure

```
resume-builder/
│
├── index.html           # Landing page with features showcase
├── home.css             # Styles for the landing page
├── workspace.html       # Full resume editor SPA (UI, state, event logic)
├── style.css            # Design system — dark/light themes, VS Code-inspired layout
│
├── server.js            # Express backend — Gemini AI API proxy (3 endpoints)
├── package.json         # Node.js project config & dependencies
├── .env                 # Secrets — Gemini API key (not committed)
│
└── templates/
    ├── utils.js         # Shared render utilities (esc, linkify, dr, buls, sh)
    ├── classic.js       # Classic serif template
    ├── executive.js     # Executive dual-column template
    ├── jakes.js         # Jake's LaTeX-style ATS template
    ├── sabrina.js       # Sabrina elegant gold template
    └── elizabeth.js     # Elizabeth modern boxed template
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML5, Vanilla CSS3, Vanilla JavaScript |
| **Backend** | Node.js + Express 5 |
| **AI Engine** | Google Gemini API via `@google/genai` SDK |
| **AI Models** | `gemini-2.5-flash` (primary) → `gemini-2.5-flash-lite` (fallback) |
| **Persistence** | Browser `localStorage` (drafts + auto-save) |
| **PDF Export** | Browser native `window.print()` — A4-optimized CSS |

---

## 🤖 AI API Endpoints

All endpoints live in `server.js` on port `5000`.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/parse-resume` | Parses raw resume text → structured JSON for all fields |
| `POST` | `/api/generate-summary` | Generates a professional 3-line summary from skills + experience |
| `POST` | `/api/score-resume` | Returns ATS score (0–100) + detailed optimization feedback |

### 🛡️ Robust Failover & Retry Engineering

The backend uses a `generateContentWithFallback()` wrapper:

1. **Primary model** — `gemini-2.5-flash` is attempted first
2. **Automatic fallback** — If quota is exhausted (`429`) or server overloaded (`503`), switches to `gemini-2.5-flash-lite`
3. **Exponential backoff** — Up to 2 retries with `1500ms → 3000ms` delay on the fallback model
4. **Safe JSON Parser** — `safeParseJSON()` handles markdown code blocks, unescaped newlines inside strings, and trailing commas from AI responses

---

## ⚙️ Setup & Installation

### Prerequisites
- **Node.js v18+**
- A free [Google AI Studio](https://aistudio.google.com/) API key

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
GEMINI_API_KEY=your_gemini_api_key_here
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

### 4. Start the Server
```bash
node server.js
```

### 5. Open the App
Navigate to **[http://localhost:5000](http://localhost:5000)**

---

## 📦 How to Use

1. **Open the app** at `http://localhost:5000`
2. Click **"Start Building Free"** to go directly to the workspace
3. The **AI Co-pilot** panel opens automatically — paste your existing resume text to auto-fill all fields instantly
4. Switch to the **Editor** tab to manually refine any section
5. Use the **ATS Auditor** to score your resume and get improvement feedback
6. Use **Design Lab** to pick a template and accent color
7. Go to **Files** to save drafts locally or export/import JSON backups
8. Click **"Export PDF"** in the top-right to download your A4-formatted resume

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

## 📌 Features Checklist

- [x] No login or signup required — open instantly
- [x] AI-powered resume parsing (Gemini 2.5 Flash)
- [x] AI professional summary generator
- [x] ATS score auditor (0–100 with detailed feedback)
- [x] Automatic model fallback with exponential backoff
- [x] 5 resume templates (Classic, Executive, Jake's, Sabrina, Elizabeth)
- [x] Drag-and-drop section reordering
- [x] Accent color picker (4 presets)
- [x] Toggle social links visibility
- [x] Profile photo upload
- [x] GitHub + Live Demo links in project entries
- [x] Auto-save to `localStorage` on every change
- [x] Draft save / load / delete (local browser storage)
- [x] JSON export and import backup
- [x] A4 PDF export via browser print
- [x] Dark / Light theme toggle with persistence
- [x] Zoom controls on resume preview canvas
- [x] AI Co-pilot opens on every first page load
- [x] Live word count diagnostics
- [x] Clear all resume data shortcut

---

## 📬 Connect

- **GitHub**: [github.com/Madhusudan04337](https://github.com/Madhusudan04337)
- **LinkedIn**: [linkedin.com/in/madhu-sudan-0006a429a](https://www.linkedin.com/in/madhu-sudan-0006a429a/)
