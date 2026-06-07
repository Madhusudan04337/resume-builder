# 📄 MDK Resume AI — Workspace Pro

> An **AI-powered Resume Builder** designed for modern professionals. Features real-time live preview, Gemini 2.5 AI integration, an ATS auditor, Cloud Authentication for draft control, and 4 meticulously crafted templates.

---

## ✨ Core Capabilities

### 🤖 Gemini AI Co-pilot
- **Intelligent Parser** — Paste raw resume text or your LinkedIn profile, and our AI instantly extracts and categorizes all your details into the workspace.
- **Magic Bullet Rewriter** — Select any bullet point and let the AI instantly rewrite it to be more impactful, action-oriented, and ATS-friendly.
- **AI Summary Polisher** — Generates a professional 3-line summary tailored to your specific skills and experience.
- **Robust Model Fallback** — Uses `gemini-2.5-flash` natively, with automatic failover to `gemini-2.5-flash-lite` using exponential backoff if quotas are exceeded.

### 📝 Precision Document Editor
- 9 fully editable document sections with live A4 preview scaling:
  - Personal Details, Education, Coursework, Experience, Projects, Skills, Spoken Languages, Achievements, Certifications
- Drag-and-drop section reordering to customize your layout flow.
- Granular control over social links (LinkedIn, GitHub, Portfolio, LeetCode, GFG, Twitter, HackerRank, CodeChef).
- Profile photo upload support.
- Inline GitHub Repository & Live Demo links embedded directly on project entries.

### 🎨 Dynamic Design Lab
- **4 Professional Layout Templates:**

  | Template | Style |
  |---|---|
  | **Classic** | Traditional serif layout |
  | **Jake's (ATS)** | LaTeX-inspired single-column format |
  | **Sabrina (Luxury Gold)** | Elegant serif layout |
  | **Elizabeth (Modern Box)** | Minimalist boxed header |

- **Brand Accent Colors** — Instantly inject personality into your document. Dynamically updates all headers and links across the layout.
- Real-time CSS rendering ensures your preview updates instantly on every single keystroke.

### ☁️ Cloud Auth & Version Control
- **Firebase Authentication** — Secure login and sign-up (Email/Password & Google OAuth) to protect your workspace.
- **Advanced Draft Control** — 
  - **Branching**: Save your current workspace as a brand new draft.
  - **Overwriting**: Push updates directly to your actively loaded draft without cluttering your history.
- **Offline JSON Backups** — Export your entire workspace state as a portable `.json` backup file and import it anytime.
- **Auto-save** — Your data is synced automatically to local storage; you never lose progress.

### 🖨️ ATS Auditor & Exporting
- **ATS Auditor Engine** — Scans your resume and returns an ATS Strength Score (0–100) alongside detailed, actionable feedback for keyword optimization.
- **Pixel-Perfect PDF Export** — A4-optimized, print-ready PDF export directly from the browser natively. Text remains completely selectable for ATS scrapers.
- Zoom controls (zoom in, zoom out, fit screen) and a live word-count diagnostic.

---

## 🏗️ Project Architecture

```
resume-builder/
│
├── index.html           # Landing page with feature showcases
├── workspace.html       # Main Application SPA (UI, state, routing, events)
├── legal.html           # Terms of Service, Privacy Policy, Security Guidelines
│
├── home.css             # Styles for the landing page
├── style.css            # Workspace design system & VS Code-inspired theme
│
├── server.js            # Node/Express backend — Gemini API proxy endpoints
├── package.json         # Project configuration & NPM scripts
├── netlify.toml         # Netlify CI/CD deployment configuration
├── build-firebase.js    # Build script to dynamically generate Firebase config
├── auth-ui.js           # Firebase authentication logic and UI modal controllers
├── auth.js              # Firebase SDK wrapper functions
├── .env                 # Secrets — Gemini & Firebase API keys (not committed)
│
└── templates/           
    ├── utils.js         # Shared document rendering utilities
    ├── classic.js       # Classic layout template logic
    ├── jakes.js         # Jake's ATS layout template logic
    ├── sabrina.js       # Sabrina layout template logic
    └── elizabeth.js     # Elizabeth layout template logic
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend UI** | HTML5, CSS3, Vanilla JavaScript |
| **Backend API Proxy** | Node.js + Express 5 |
| **Authentication** | Google Firebase Auth |
| **AI Intelligence** | Google Gemini API (`@google/genai` SDK) |
| **State Persistence** | Browser `localStorage` + JSON state serialization |
| **Hosting & CI/CD** | Pre-configured for Netlify |

---

## ⚙️ Setup & Local Installation

### Prerequisites
- **Node.js v18+**
- A free [Google AI Studio](https://aistudio.google.com/) API key
- A free [Firebase Project](https://console.firebase.google.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/Madhusudan04337/resume-builder.git
cd resume-builder
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory. This file is ignored by Git to keep your credentials secure.

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

### 4. Build Firebase Config
Run the build script to securely generate your local `firebase.js` file from your `.env` variables:
```bash
npm run build
```

### 5. Start the Server
```bash
npm start
```
Navigate to **[http://localhost:5000](http://localhost:5000)** in your browser.

> **Note:** If you are testing Google Login locally, ensure `127.0.0.1` or `localhost` is added to your **Authorized Domains** inside the Firebase Authentication settings.

---

## 🚀 Cloud Deployment (Netlify)

This repository is optimized for deployment on Netlify.
1. Connect your GitHub repository to Netlify.
2. Go to your Netlify dashboard: **Site settings > Environment variables**.
3. Add all the keys from your `.env` file into the Netlify dashboard.
4. Deploy! The included `netlify.toml` automatically runs `npm run build` during the deployment process to securely generate your Firebase configuration on the server.

---

## 📬 Connect

- **GitHub**: [github.com/Madhusudan04337](https://github.com/Madhusudan04337)
- **LinkedIn**: [linkedin.com/in/madhu-sudan-0006a429a](https://www.linkedin.com/in/madhu-sudan-0006a429a/)
