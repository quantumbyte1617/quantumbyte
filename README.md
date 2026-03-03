# QuantumByte

**Live:** [quantumbyte.app](https://quantumbyte.app)

Free tools that just work. No sign-ups, no fluff.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend + API | Next.js 15 (App Router, TypeScript) |
| Styling | Tailwind CSS 4 + Framer Motion |
| Deployment | Vercel |
| PDF Backend | FastAPI + pikepdf (Railway) |

---

## Tools

### PDF Unlocker — `/pdf-unlocker`
Remove the password from a protected PDF.

- **Know the password** — upload PDF, enter password, download unlocked version
- **Forgot password** — auto-tries ~100 common passwords (blank, numbers, years, filename, common words)
- Shows the recovered password when found

**Architecture:**
```
Vercel (Next.js)  →  /api/pdf-unlocker  →  Railway (FastAPI + pikepdf)
                      /api/pdf-unlocker/recover
```

**Env var required:**
```
PDF_UNLOCKER_BACKEND_URL=https://pdf-unlocker-backend-production.up.railway.app
```

---

### AI Discussion — `/ai-discussion`
Real-time debate room. Pick a topic and watch Claude, GPT-4o, Gemini, and Grok debate it.

**How it works:**
1. Each AI answers independently (blind round)
2. AIs debate each other over multiple rounds
3. Gemini synthesises a final answer from the full transcript

**Persona modes** (4 response styles):

| Persona | Best for | Style |
|---|---|---|
| 💬 Casual *(default)* | Quick questions, small talk | 1-4 sentences, emoji ok, conversational |
| 📊 Professional | Business ideas, strategy, analysis | Deep, structured, no length cap |
| ⚙️ Technical | Code, architecture, systems | Precise, snippets, step-by-step |
| ✨ Creative | Brainstorming, brand, storytelling | Flowing prose, vivid, personality-driven |

Persona applies to all debate rounds **and** the final answer.

**API routes:**
```
/api/ai-discussion/claude
/api/ai-discussion/chatgpt
/api/ai-discussion/gemini
/api/ai-discussion/grok
```

**Env vars required:**
```
ANTHROPIC_API_KEY=...
OPENAI_API_KEY=...
GEMINI_API_KEY=...
XAI_API_KEY=...
```

---

### FS Reviewer — `/fs-reviewer`
AI-powered cross-checking of Arabic and English financial statements.

---

### Video Downloader — `/video-downloader`
Download videos from YouTube, Instagram, TikTok, and more.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                        # Home + nav
│   ├── pdf-unlocker/
│   │   └── page.tsx
│   ├── ai-discussion/
│   │   └── page.tsx
│   ├── fs-reviewer/
│   │   ├── page.tsx
│   │   └── results/page.tsx
│   ├── video-downloader/
│   │   └── page.tsx
│   └── api/
│       ├── pdf-unlocker/
│       │   ├── route.ts                # Proxy → Railway
│       │   └── recover/route.ts        # Forgot password proxy
│       ├── ai-discussion/
│       │   ├── claude/route.ts
│       │   ├── chatgpt/route.ts
│       │   ├── gemini/route.ts
│       │   └── grok/route.ts
│       └── fs-reviewer/
│           └── analyze/route.ts
├── lib/
│   └── constants.ts                    # App registry, nav links
└── components/
    └── QuantumBackground.tsx
```

---

## Related Projects

| Project | Path | Purpose |
|---|---|---|
| PDF Unlocker backend | `/Projects/pdf-unlocker/backend/` | FastAPI + pikepdf on Railway |
| PDF Unlocker standalone | `/Projects/pdf-unlocker/nextjs-app/` | Standalone Next.js version |
| AI Discussion (original) | `/Projects/ai-discussion/discussion-room/` | Source project (ai-council.vercel.app) |

---

## Local Development

```bash
# Install dependencies
npm install

# Set up env vars
cp .env.example .env.local
# Fill in API keys

# Run dev server
npm run dev
```

## Deployment

```bash
# Deploy to Vercel (production)
vercel --prod

# Deploy PDF backend to Railway
cd ../pdf-unlocker/backend
railway up --service pdf-unlocker-backend
```
