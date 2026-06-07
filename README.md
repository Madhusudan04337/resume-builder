# 📄 MDK Resume AI — Workspace Pro

> A powerful **AI-powered Resume Builder** with real-time preview, multiple professional templates, Gemini AI integration, ATS scoring, Cloud Authentication, and a clean VS Code-inspired workspace UI.

---

## ✨ Features at a Glance

### 🤖 Gemini AI Co-pilot & Magic Wand
- **Intelligent Resume Parser** — Paste raw resume text or LinkedIn data, and Gemini AI auto-fills all fields instantly.
- **AI Summary Polisher** — Generates a professional 3-line summary based on your skills & experience.
- **Magic Bullet Rewriter** — Select any bullet point and let AI instantly rewrite it to be more impactful and ATS-friendly.
- **Automatic Model Fallback** — Switches from `gemini-2.5-flash` → `gemini-2.5-flash-lite` with exponential backoff if quota is exceeded.

### 📝 Document Editor
- 9 editable resume sections with live A4 preview:
  - Personal Details, Education, Coursework, Experience, Projects, Skills, Spoken Languages, Leadership / Achievements, Certifications
- Toggle social links on/off (LinkedIn, GitHub, Portfolio, LeetCode, GFG, Twitter, HackerRank, CodeChef)
- Profile photo upload support
- Drag-and-drop section reordering
- Inline GitHub Repository & Live Demo links on project entries

### 🎨 Design Lab
- **Multiple Resume Templates:**
  | Template | Style |
  |---|---|
  | **Classic** | Traditional serif (Georgia), centered header |
  | **Executive** | Dual-column compact structure |
  | **Jake's (ATS)** | LaTeX-inspired single-column, ATS-optimized |
  | **Sabrina** | Elegant luxury gold serif layout |
  | **Elizabeth** | Minimalist modern boxed header |

- **Accent Brand Color Picker** — Dynamically updates all headers and links across the resume
- Live preview updates instantly on every change

### ☁️ Cloud Authentication & Draft Control
- **Firebase Auth** — Secure login and sign-up (Email/Password & Google Login) to protect your workspaces.
- **Branch & Overwrite Drafts** — Manage your resume versions by branching out a "Save New" draft, or instantly "Overwrite" your current active draft.
- **Export / Import JSON** — Download your full workspace state as a `.json` backup and restore it anytime.
- **Auto-save** — Your data is automatically synced locally so you never lose progress.

### 🖨️ Export & ATS Auditor
- **ATS Score Auditor** — Scores your resume from 0–100 with actionable keyword and clarity feedback.
- **Export PDF** — Pixel-perfect, A4-optimized, print-ready PDF export directly from the browser natively.
- Zoom controls (zoom in, zoom out, fit screen) and live word count.

---

## 🏗️ Project Structure

```
resume-builder/
│
├── index.html           # Landing page with features showcase
├── home.css             # Styles for the landing page
├── workspace.html       # Full resume editor SPA (UI, state, event logic)
├── style.css            # Design system — dark/light themes, VS Code-inspired layout
├── legal.html           # Terms, Privacy Policy, Security guidelines
│
├── server.js            # Express backend — Gemini AI API proxy
├── package.json         # Node.js project config & scripts
├── netlify.toml         # Netlify CI/CD configuration
├── build-firebase.js    # Build script to dynamically generate Firebase config
├── auth-ui.js           # Firebase authentication logic and UI controllers
├── .env                 # Secrets — Gemini & Firebase API keys (not committed)
│
└── templates/           # Individual JS files handling template HTML generation
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML5, Vanilla CSS3, Vanilla JavaScript |
| **Backend** | Node.js + Express 5 |
| **Authentication** | Google Firebase Auth |
| **AI Engine** | Google Gemini API via `@google/genai` SDK |
| **Persistence** | Browser `localStorage` + Cloud Draft logic |
| **Hosting** | Ready for deployment via Netlify |

---

## ⚙️ Setup & Installation

### Prerequisites
- **Node.js v18+**
- A free [Google AI Studio](https://aistudio.google.com/) API key
- A free [Firebase Project](https://firebase.google.com/) configuration

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
Create a `.env` file in the root directory and add your keys:

```env
GEMINI_API_KEY=your_gemini_api_key_here
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project
FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456:web:123abc456
FIREBASE_MEASUREMENT_ID=G-12345ABC
```

> ⚠️ **Security Note:** `firebase.js` is included in `.gitignore` to prevent credential leaks on GitHub.

### 4. Build Firebase Config
Generate your local `firebase.js` file from your `.env` variables:
```bash
npm run build
```

### 5. Start the Server
```bash
npm start
```
Navigate to **[http://localhost:5000](http://localhost:5000)**

---

## 🚀 Deployment (Netlify)
This project is configured out-of-the-box for **Netlify**. 
1. Connect your GitHub repository to Netlify.
2. In the Netlify dashboard, go to **Site settings > Environment variables** and paste all your `.env` variables.
3. The `netlify.toml` file automatically triggers `npm run build` during deployment, securely generating your Firebase configuration on their servers!

---

## 📌 Features Checklist

- [x] Secure Firebase Authentication (Email/Password & Google)
- [x] AI-powered resume parsing (Gemini 2.5 Flash)
- [x] Magic AI Bullet Rewriter
- [x] ATS score auditor (0–100 with detailed feedback)
- [x] Automatic model fallback with exponential backoff
- [x] 5 resume templates (Classic, Executive, Jake's, Sabrina, Elizabeth)
- [x] Drag-and-drop section reordering
- [x] Accent color picker (4 presets)
- [x] Toggle social links visibility
- [x] Branch Drafts / Overwrite Drafts
- [x] JSON export and import backup
- [x] Pixel-perfect A4 PDF export
- [x] Dark / Light theme toggle with persistence
- [x] Live word count diagnostics

---

## 📬 Connect

- **GitHub**: [github.com/Madhusudan04337](https://github.com/Madhusudan04337)
- **LinkedIn**: [linkedin.com/in/madhu-sudan-0006a429a](https://www.linkedin.com/in/madhu-sudan-0006a429a/)
