# YouTube Transcript SaaS Backend – **Transcripto**

A scalable, AI-powered backend for the Transcripto SaaS platform, built using Python and [FastAPI](https://fastapi.tiangolo.com/). It powers YouTube transcript extraction, user authentication, subscription management, and real-time AI chat features.

---

## ⚙️ Key Features

- 🧠 AI-driven transcript Q&A via WebSocket
- 🆔 User authentication and profile management (Supabase + JWT)
- 📽️ YouTube transcript, playlist, and channel extraction
- 💳 Stripe payments and webhooks
- 📜 Transcript history and usage limits
- ⚡ Fast, asynchronous API with FastAPI & Uvicorn

---

## 🛠️ Tech Stack

- **FastAPI** – High-performance async API framework
- **Uvicorn** – ASGI server
- **Supabase** – Postgres DB + Auth
- **Stripe** – Subscription payments
- **OpenRouter API** – AI assistant (real-time streaming)
- **YouTube Data API + youtube\_transcript\_api** – Transcript extraction
- **pytube** – Channel and playlist metadata
- **httpx / requests** – Async/sync HTTP clients
- **Pydantic** – Data validation
- **dotenv** – Environment configuration

---

## 📂 File Structure

```
server/
├── app.py                   # Main FastAPI app
├── auth.py                  # Supabase authentication & JWT handling
├── database.py              # DB logic: profiles, subscriptions, usage
├── get_video_transcript.py  # Transcript extraction logic
├── models.py                # Pydantic schemas
├── ai_prompts.py            # Prompt logic for AI assistant
├── requirements.txt
├── api/
│   ├── auth_routes.py       # /auth endpoints
│   ├── profile_routes.py    # /profile endpoints
│   ├── transcript_routes.py # /transcript endpoints
│   ├── playlist_routes.py   # /playlist endpoints
│   ├── channel_routes.py    # /channel endpoints
│   ├── stripe_routes.py     # Stripe integration
│   └── websocket_routes.py  # Real-time AI assistant
└── stripe/
```

---

## 🔐 Authentication & Profiles

- **Supabase Auth**: Email/password sign-in
- **JWT Tokens**: Signed and verified via `supabase-jwt-secret`
- **Profiles**: Created on signup, retrieved via `/profile`, updated via `/account`

---

## 🎬 Transcript Features

- **/transcript**: Extract one or multiple video transcripts
- **/transcript/{id}**: Retrieve transcript by video ID
- **History**: Logged in Supabase for authenticated users
- **Quota**: Usage enforcement per plan (free/paid)

---

## 📺 Playlist & Channel

- **/playlist**: Fetch all videos in a playlist
- **/channel**: Fetch channel metadata and playlists
- Uses `pytube` and YouTube Data API

---

## 💳 Stripe Integration

- **/create-checkout-session**: Stripe hosted checkout
- **/webhook**: Payment event listener
- **Plans & Status**: Updated in Supabase on success/cancel

---

## 🧠 AI Chat Assistant

- **WebSocket endpoint**: `/ai-chat`
- **Streaming responses** via OpenRouter API
- Tasks include: summary, Q&A, highlights, study guide
- Works per transcript context

---

## 🌍 Environment Variables

Use `.env` to configure:

```
SUPABASE_URL=
SUPABASE_KEY=
SUPABASE_JWT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
YOUTUBE_API_KEY=
OPENROUTER_API_KEY=
OPENROUTER_MODEL=
```

---

## 🧪 Local Development

```bash
pip install -r requirements.txt
uvicorn app:app --reload
```

---

## 🔐 Security

- JWT verification for protected endpoints
- CORS setup for frontend
- Secrets managed via `.env`
- Stripe webhook signature verification

---

## 🔄 Request Flow Summary

1. **User signs in**: Frontend stores JWT
2. **Frontend calls API**: Auth headers added
3. **Backend processes**: Validates, fetches/stores transcript
4. **User interacts**: History, chat assistant, subscription
5. **Webhooks**: Stripe triggers update on payment events

---

## 📌 Summary

This backend powers the full transcript experience for **Transcripto** – from extracting YouTube data to chatting with transcripts via AI. It combines FastAPI, Supabase, Stripe, and OpenRouter into a high-performance microservice backend for modern SaaS needs.

---

Feel free to fork, contribute, or open an issue.

