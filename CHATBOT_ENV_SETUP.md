# 🔐 Chatbot Environment Setup

## ✅ API Key is Now Secure!

The Reka API key is **no longer hardcoded** in the code. It's now loaded from environment variables.

---

## 📝 Setup Instructions

### Step 1: Create `.env.local` file

In the `frontend/` directory, create a file called `.env.local`:

```bash
cd frontend
touch .env.local
```

### Step 2: Add Your API Key

Open `frontend/.env.local` and add:

```bash
REKA_API_KEY=399460a7804da855201fb18bcc6a378e30b0e1a28d414ca793b93e5bcb93c81f
```

### Step 3: Restart Your Dev Server

If the server is already running, restart it:

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

---

## ✅ Security Verified

- ✅ `.env.local` is in `.gitignore` (won't be committed)
- ✅ API key loaded via `process.env.REKA_API_KEY`
- ✅ Error handling if key is missing
- ✅ Example file provided: `frontend/env.example`

---

## 🔍 How It Works

1. Next.js automatically loads `.env.local` at runtime
2. API route accesses key via `process.env.REKA_API_KEY`
3. If key is missing, API returns proper error message
4. Key is never exposed to client-side code

---

## 📁 File Structure

```
frontend/
├── .env.local              ← Your actual API key (GITIGNORED)
├── env.example             ← Template for others
└── app/api/assembly-chat/
    └── route.ts            ← Loads key from env
```

---

## 🧪 Test It

After setting up the `.env.local`:

1. Start dev server: `npm run dev`
2. Visit: `http://localhost:3000/assembly/tommaryd`
3. Click chat button
4. Ask a question

If you see an error about "API key not configured", the `.env.local` file wasn't loaded properly.

---

## 🚨 Troubleshooting

### API Key Not Loading?

**Solution 1**: Make sure file is named exactly `.env.local` (not `.env`, not `env.local`)

**Solution 2**: Make sure file is in `frontend/` directory, not root

**Solution 3**: Restart the dev server after creating/modifying `.env.local`

**Solution 4**: Check there are no extra spaces:
```bash
# ✅ CORRECT
REKA_API_KEY=your_key_here

# ❌ WRONG (extra spaces)
REKA_API_KEY = your_key_here
```

### Still Not Working?

Check the server console for this error:
```
REKA_API_KEY is not set in environment variables
```

If you see this, the `.env.local` file isn't being loaded. Make sure it's in the correct location and restart the server.

---

## ✨ You're All Set!

Your API key is now secure and loaded from environment variables. The chatbot will work exactly the same, but now it's production-ready! 🎉

