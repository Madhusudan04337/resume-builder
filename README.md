# 📄 MDK Resume AI — Workspace Pro

> A powerful, full-stack **AI-powered Resume Builder** with real-time preview, 6 professional templates, Gemini AI integration, ATS scoring, and local draft management — all in a clean, VS Code-inspired workspace UI.

---

## ✨ Features at a Glance

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

### 💾 Workspace Files
- **Saved Drafts** — Save/load multiple resume versions in browser `localStorage`
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
├── index.html          # Full single-page frontend app (UI, state, event logic)
├── style.css           # Full design system — dark/light themes, VS Code-inspired layout
├── server.js           # Express backend — Gemini AI API routes
├── package.json        # Node.js project config & dependencies
├── .env                # API key (not committed — see .gitignore)
│
└── templates/
    ├── utils.js        # Shared render utilities (esc, linkify, dr, buls, sh)
    ├── classic.js      # Classic serif template
    ├── modern.js       # Modern sans-serif template
    ├── professional.js # Compact professional template
    ├── signature.js    # Signature italic template
    ├── executive.js    # Executive dual-column template
    └── jakes.js        # Jake's LaTeX-style ATS template
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML5, Vanilla CSS3, Vanilla JavaScript (ES5-compatible) |
| **Backend** | Node.js + Express 5 |
| **AI Engine** | Google Gemini API via `@google/genai` SDK |
| **AI Models** | `gemini-2.5-flash` (primary) → `gemini-2.5-flash-lite` (fallback) |
| **Persistence** | Browser `localStorage` (auto-save + drafts) |
| **PDF Export** | Browser native `window.print()` — A4-optimized CSS |

---

## 🤖 AI Backend — API Endpoints

All endpoints live in `server.js` on port `5000`.

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

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+ installed
- A [Google AI Studio](https://aistudio.google.com/) API key (free tier works)

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

### 4. Start the Backend Server
```bash
npm start
# or
node server.js
```
The server starts on **`http://localhost:5000`**.

### 5. Open the App
Open `index.html` directly in your browser, or navigate to `http://localhost:5000`.

> The frontend auto-detects whether it's running on a file path or local dev server and routes AI API calls to `http://localhost:5000` automatically.

---

## 📦 How to Use

1. **Open the app** — The **AI Co-pilot** panel opens automatically
2. **Paste your existing resume** text into the parser textarea
3. Click **"Auto-fill with AI"** — all fields are extracted and filled instantly
4. Switch to the **Editor** tab to manually refine any section
5. Use **Design Lab** to pick a template and accent color
6. Click **"Export PDF"** in the top-right to download your resume

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
- [x] Auto-save to localStorage
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
