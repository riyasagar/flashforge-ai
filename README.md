# ⚡ FlashForge — AI Flashcard Engine
FlashForge is an AI-powered web application that transforms PDFs into smart, interactive flashcards. It helps students study more effectively using active recall and adaptive learning techniques, turning static content into a dynamic learning experience.


![FlashForge](https://img.shields.io/badge/FlashForge-AI%20Flashcard%20Engine-5B4BF5?style=for-the-badge&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![Groq](https://img.shields.io/badge/AI-Groq%20API-F55036?style=flat-square)
![Render](https://img.shields.io/badge/Deployed-Render-46E3B7?style=flat-square&logo=render)
 
---
## 🌐 Live Demo  
https://flashforge-ai-qzyx.onrender.com  
---

## ✨ Features

- 📄 Upload PDFs (drag & drop support)  
- ⚡ AI-generated flashcards from study material  
- 🧠 Adaptive spaced repetition for better retention  
- 🎯 Study modes: Due Cards & All Cards  
- 📊 Progress tracking (New → Learning → Reviewing → Mastered)  
- 💾 Persistent storage (server + local cache)  
- 📤 Export / Import decks (JSON)  
- ✏️ Edit or remove cards before saving  
- 💡 Hint system for guided learning  
- ⌨️ Keyboard shortcuts (Space, 1–4)  
---
## 🛠️ Tech Stack  

- **Frontend:** React + Vite  
- **Backend:** Node.js + Express  
- **AI:** Groq API  
- **Storage:** JSON + localStorage

---
## ⚙️ Local Setup

### Terminal 1 — Backend
```bash
cd backend
cp .env.example .env
# Edit .env → paste your GROQ_API_KEY
npm install
node server.js
# → http://localhost:5000
```

### Terminal 2 — Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173  (proxied to backend automatically)
```

---

## 🌐 Deploy to Render 

1. Push to GitHub
2. Render → New Web Service → connect repo
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && cd ../frontend && npm install && npm run build`
   - **Start Command:** `node server.js`
4. Environment Variables:
   - `GROQ_API_KEY` = your key
   - `NODE_ENV` = `production`
5. Deploy ✅— Render builds everything and gives you a public URL.
