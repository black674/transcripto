# YouTube Transcript SaaS Frontend – **Transcripto**



A modern, SaaS-style React-based frontend for extracting and interacting with YouTube video transcripts.

---

## 🚀 Features

- 🎬 Extract transcripts from YouTube video or playlist URLs
- 🧠 Real-time transcript Q&A with AI chat assistant (WebSocket-powered)
- 📄 Copy, search, and download transcripts
- 🔐 User authentication with JWT & session handling
- 📚 View transcript history
- 👤 Manage user profile and subscription
- 📁 Markdown pages for FAQ, Privacy, Terms, etc.

---

## 🛠️ Tech Stack

### Frontend

- **React 19** – UI Library
- **Vite** – Lightning-fast dev server and bundler
- **React Router DOM** – Client-side routing
- **Tailwind CSS** – Utility-first styling
- **Radix UI** – Accessible UI primitives
- **Framer Motion** – Smooth animations
- **React Hook Form + Zod** – Form handling and schema validation
- **Lucide Icons** – Icon system
- **Sonner** – Toast notifications
- **React Markdown + Remark GFM** – Render static markdown content
- **React Use WebSocket** – WebSocket support for assistant
- **File Saver + JSZip** – Transcript download and zip
- **Next Themes** – Light/Dark theming

### Architecture

- Context-based state management
- Modular & scalable folder structure
- Custom hooks for authentication, modals, and transcripts

---

## 📁 Project Structure

```
src/
├── App.jsx                # App entry point
├── main.jsx               # Root render
├── components/            # Shared and UI components
├── layouts/               # Header, footer, and layouts
├── pages/                 # Page-based routing
├── lib/                   # API, context, utils, auth
├── style/                 # Tailwind and global styles
```

---

## 🌐 Pages Overview

| Page                    | Description                                                         |
| ----------------------- | ------------------------------------------------------------------- |
| `HomePage`              | Landing page with transcript extractor and feature overview         |
| `TranscriptPage`        | Watch video + view/search/copy/download transcript + assistant chat |
| `PlaylistPage`          | Input YouTube playlist URL and extract batch transcripts            |
| `ExtractTranscriptPage` | Private extractor for logged-in users                               |
| `HistoryPage`           | View extracted transcripts history                                  |
| `ProfilePage`           | User info and subscription status                                   |
| `PricingPage`           | Pricing tiers overview                                              |
| `ContactPage`           | Contact form + FAQ section                                          |
| `MarkdownPage`          | Renders markdown pages (FAQ, Privacy, Terms)                        |
| `NotFoundPage`          | Custom 404 page                                                     |

---

## 🔐 Authentication

- Uses **React Context** for user state
- JWT-based login with refresh handling
- Session is persisted across refresh
- Login/Signup via modal interface

---

## 🧠 Assistant Chat (WebSocket)

- Users can interact with a chat assistant
- Ask questions based on video transcript content
- Powered by WebSocket with real-time updates

---

## 📦 Environment Variables

Create a `.env` file in the root directory:

```
VITE_APP_BASE_URL=https://your-api-url.com
```

---

## 📌 How It Works

1. User lands on homepage
2. Pastes a YouTube video or playlist URL
3. If authenticated, redirected to the relevant transcript/playlist page
4. Transcript loads with all available actions (search, copy, download, chat)
5. History, profile, pricing, and docs available from the navigation

---

## 🧪 Local Development

```bash
npm install
npm run dev
```

---

## 📄 License

MIT License. Feel free to fork, use, or contribute.

