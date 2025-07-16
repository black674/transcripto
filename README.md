# Transcripto – YouTube Transcript SaaS

Transcripto is a modern, AI-powered SaaS platform that allows users to extract, view, and interact with YouTube video transcripts. Built primarily to showcase frontend expertise using **React + Vite + Tailwind**, the project also includes a lightweight **FastAPI** backend integrated with AI features to support transcript-based Q&A, authentication, history, and subscriptions.

> 💡 **Note:** While the backend is included, the focus of this project is on demonstrating advanced frontend architecture, UI/UX design, and integration with real APIs.

---

## 🧭 Project Structure

```
transcripto/
├── client/        # Frontend (React + Vite)
│   └── README.md  # Frontend documentation
├── server/        # Backend (FastAPI)
│   └── README.md  # Backend documentation
└── README.md      # Root project overview
```

---

## 🧠 Frontend Overview (`/client`)

Built with **React 19** and **Vite**, the frontend offers a fast, responsive, and user-friendly experience with:

- Transcript extraction by pasting YouTube video/playlist URLs

- Real-time AI assistant (chat about transcript)

- Protected pages for viewing history and profile

- Toast notifications and animated UI interactions

- Markdown-based FAQ, Terms, and Privacy pages

- Integrated Stripe UI for subscription management

🔗 Full details in [`client/README.md`](./client/README.md)

---

## 🧪 Backend Overview (`/server`)

The backend is a compact **FastAPI** service that supports the frontend with:

- REST API for transcript extraction, profiles, authentication, and payments
- WebSocket API for streaming chat responses using OpenRouter (AI)
- Supabase integration for authentication and user storage
- Stripe integration for subscriptions and usage limits

🔗 Full details in [`server/README.md`](./server/README.md)

> 🤖 The backend is intentionally built using AI capabilities to support the assistant feature, but kept lightweight and modular to support frontend demonstration.

---

## 🔧 Local Development

### Prerequisites

- Node.js + npm
- Python 3.10+

### Setup

```bash
# 1. Clone the project
$ git clone https://github.com/black674/transcripto.git
$ cd transcripto

# 2. Install frontend dependencies
$ cd client
$ npm install
$ npm run dev

# 3. In a new terminal, run backend
$ cd ../server
$ pip install -r requirements.txt
$ uvicorn app:app --reload
```

---

## 📌 Summary

Transcripto combines modern frontend development with smart backend features to offer an elegant, functional experience for YouTube transcript interaction. It demonstrates how a responsive UI, real-time features, and AI integration can work together in a production-ready SaaS interface.

---

If you're reviewing this project for frontend skills, focus on the `/client` folder. For backend logic or AI/WebSocket handling, explore `/server`.
