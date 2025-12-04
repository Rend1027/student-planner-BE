# Smart Student Scheduler — Frontend (Vite + React)

This is the **frontend** for Smart Student Scheduler — a mobile-style web app that lets students manage **classes, events, and appointments**.

Backend (PHP + MySQL + JWT) lives in a separate folder: `student-planner-BE/`.

---

## 🧱 Tech Stack

- **Vite + React**
- **React Router** (for `/login`, `/register`, `/dashboard`)
- **Context API** for auth (`AuthContext`)
- **Fetch API** + JWT token stored in `localStorage`
- **Pure CSS** (`global.css`) for styling (no Tailwind/Bootstrap)

---

## ⚙️ Prerequisites

- **Node.js**: v18+ recommended
- **npm**: v9+ recommended
- Backend running on **http://localhost:8000**

> 🔴 If the backend is not running, login/register/events will not work.

---

## 🚀 Getting Started

From the `student-planner-FE/` directory:

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

Folder Structure: 

src/
  api/
    client.js          # All API requests + JWT handling
  context/
    AuthContext.jsx    # Auth state, login/logout logic
  pages/
    LoginPage.jsx      # Login UI + form
    RegisterPage.jsx   # Register UI + form
    DashboardPage.jsx  # Main scheduler UI (events/classes)
  styles/
    global.css         # All styling for mobile app look
  App.jsx              # Routing & layout
  main.jsx             # React entry point
