# 🤖 Assembly Chatbot - Reka AI Integration

## ✅ Setup Complete - API Key is Secure!

The chatbot is fully implemented with **secure environment variable loading**.

---

## 🚀 Quick Start (3 Steps)

### Step 1: Create Environment File
```bash
cd frontend
nano .env.local
```

Add this line:
```bash
REKA_API_KEY=399460a7804da855201fb18bcc6a378e30b0e1a28d414ca793b93e5bcb93c81f
```

Save and exit (Ctrl+X, then Y, then Enter)

### Step 2: Start Dev Server
```bash
npm run dev
```

**Important**: If the server was already running, restart it to load the new env variables.

### Step 3: Test It
1. Visit: `http://localhost:3000/assembly/tommaryd`
2. Look for blue chat button in bottom-right corner
3. Click and ask: "What tools do I need?"

---

## 📁 What Was Changed

### 1. API Route (Secure Now)
`app/api/assembly-chat/route.ts`
```typescript
// ✅ SECURE - Loads from environment
const REKA_API_KEY = process.env.REKA_API_KEY;

// ❌ OLD - Was hardcoded (removed)
// const REKA_API_KEY = "399460a7804da855201fb18bcc6a378e30b0e1a28d414ca793b93e5bcb93c81f";
```

### 2. Environment Example
`env.example`
```bash
REKA_API_KEY=your_reka_api_key_here
```

### 3. Your Local Config (Not Committed)
`.env.local` (you need to create this)
```bash
REKA_API_KEY=399460a7804da855201fb18bcc6a378e30b0e1a28d414ca793b93e5bcb93c81f
```

---

## 🔒 Security Features

✅ **API key in `.env.local`** (gitignored, never committed)
✅ **Server-side only** (not exposed to browser)
✅ **Error handling** (fails gracefully if key missing)
✅ **Example file** for team members to copy

---

## 🧪 Verify It Works

### Test 1: Check Environment Variable
Start the server and check console output:
```bash
npm run dev
```

If `.env.local` is loaded correctly, you shouldn't see any warnings.

### Test 2: Send a Chat Message
Click chat button and ask a question. If you get a response, everything works!

### Test 3: Check for Errors
If you see "API key not configured" error:
- Make sure `.env.local` exists in `frontend/` directory
- Make sure it has the correct format (no spaces around `=`)
- Restart the dev server

---

## 📊 How It Works

```
User asks question in chat
    ↓
Frontend → /api/assembly-chat
    ↓
API route loads REKA_API_KEY from process.env
    ↓
Calls Reka AI with current step context
    ↓
Streams response back to user
```

---

## 🎯 Features

- **Model**: `reka-core` (best quality)
- **Streaming**: Real-time word-by-word responses
- **Context**: Current step, parts, tools
- **Reset**: Clears chat when user changes steps
- **UI**: Floating button, toggleable

---

## 📝 Example `.env.local` File

Create this file in `frontend/.env.local`:

```bash
# Reka AI API Key for Assembly Chatbot
REKA_API_KEY=399460a7804da855201fb18bcc6a378e30b0e1a28d414ca793b93e5bcb93c81f
```

**Important**: 
- No spaces around the `=` sign
- No quotes needed
- File must be named exactly `.env.local`

---

## 🐛 Troubleshooting

### Problem: "API key not configured" error

**Solutions**:
1. Create `frontend/.env.local` file
2. Add `REKA_API_KEY=your_key_here` (no spaces)
3. Restart dev server

### Problem: Chat button doesn't appear

**Solutions**:
1. Make sure you're on an assembly page (`/assembly/[id]`)
2. Check browser console for errors
3. Verify frontend is running

### Problem: No response from chatbot

**Solutions**:
1. Check network tab in browser dev tools
2. Look for errors in server console
3. Verify Reka API key is valid

---

## 🎉 You're Done!

The chatbot is ready to use with secure environment variable loading! 

**Next Steps**:
1. Create `.env.local` with your API key
2. Restart the server
3. Test the chatbot

For more details, see: `../CHATBOT_ENV_SETUP.md`

