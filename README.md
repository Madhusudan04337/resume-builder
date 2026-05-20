# 📄 AI Resume Builder

A clean and interactive **Resume Builder Web App** designed to help you create, customize, and export professional resumes effortlessly.

This project was built to **maintain and reuse my own resume template** while also making it flexible for quick updates.

---

## 🚀 Features

- ✨ Real-time Resume Preview  
- 🧩 Modular Sections:
  - Personal Details  
  - Education  
  - Experience  
  - Projects  
  - Skills  
  - Certifications  
  - Leadership / Achievements  
- 🔗 Toggle social links (LinkedIn, GitHub, etc.)  
- 📄 Export resume as **PDF (A4 optimized)**  
- 🎯 Clean, minimal, ATS-friendly design  

---

## 🤖 AI Smart Import (Google Gemini API)

This project integrates the **Google Gemini API** via the official Node.js SDK (`@google/genai`) to automatically:

- **AI Smart Import / Parsing**: Automatically parses raw resume text and extracts formatted structured JSON to auto-fill all form fields.
- **AI Summary Generator**: Creates a professional, customized 3-line resume summary based on your skills and experience.
- **ATS Resume Evaluator**: Analyzes and evaluates your resume to assign an ATS score (0-100) and provides tailored, actionable advice for optimization.

### 🛡️ Robust Failover & Retry Engineering
To ensure high availability and bypass standard Free Tier rate limits:
- **Model Fallback**: If the primary model `gemini-2.5-flash` experiences quota exhaustion (429), the backend instantly failovers to the highly-optimized `gemini-2.5-flash-lite`.
- **Transient Error Recovery**: Built-in exponential backoff retries (up to 2 attempts) for transient `503 Service Unavailable` spikes, ensuring smooth operations.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (Print-ready, A4-optimized layout)
- **Backend**: Node.js, Express, Cors, Dotenv
- **AI Engine**: Google Gemini API via official `@google/genai` SDK (running on `gemini-2.5-flash` and `gemini-2.5-flash-lite`)

---

## ⚙️ Quick Backend Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Environment Configuration**:
   Create a `.env` file in the root directory and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
3. **Start the Backend**:
   ```bash
   node server.js
   ```
   The backend will start running on port `5000`.

---

## 📦 How to Use

1. Open the app  
2. Fill details manually  
   **OR**  
3. Paste your resume into **AI Smart Import**  
4. (With backend enabled) click **Auto-fill with AI**  
5. Edit content as needed  
6. Click **Download as PDF**

---

## 🎯 Purpose of This Project

I built this tool to:

- Maintain a **consistent resume template**  
- Quickly update resumes for different roles  
- Experiment with **AI-powered resume parsing**  
- Improve productivity during job applications  

---

## 📸 UI Highlights

- Two-panel layout (Form + Live Preview)  
- Toggle-based contact visibility  
- Structured and professional formatting  
- Print-ready design  

---

## 📌 Future Improvements

- [x] Backend integration for AI feature  
- [x] Multiple resume templates  
- [x] Save & load resume data  
- [x] Drag-and-drop section ordering  
- [x] Resume scoring (ATS optimization)  

---

## 📬 Connect

- GitHub: https://github.com/Madhusudan04337  
- LinkedIn: https://www.linkedin.com/in/madhu-sudan-0006a429a/
