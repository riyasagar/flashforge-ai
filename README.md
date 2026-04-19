# ⚡ FlashForge — AI Flashcard Engine
FlashForge is an AI-powered web application that transforms PDFs into smart, interactive flashcards. It helps students study more effectively using active recall and adaptive learning techniques, turning static content into a dynamic learning experience.


---

## ✨ Features
- PDF upload (drag & drop, up to 50MB)
- AI generates 8–35 cards based on PDF length
- SM-2 spaced repetition (same as Anki)
- "Study Due Cards" vs "Study All" mode
- Progress: New → Learning → Reviewing → Mastered
- Persistent storage: server JSON + localStorage cache
- Export / Import decks as JSON
- Edit/remove cards before saving
- Hint system per card
- Keyboard shortcuts (Space, 1–4)
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
5. Deploy ✅

The backend serves the built frontend at the root URL.
