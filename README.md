# chat.mytripraja.com

1:1 messaging + voice/video calls for MyTripRaja. Vite + React + Firebase, deployed on Vercel.

## Setup (GitHub web UI + Vercel, no local dev needed)

1. **Create the repo**: New repo on GitHub, e.g. `mytripraja-chat`. Upload all files in this folder
   via GitHub's web UI ("Add file" → "Upload files"), keeping the folder structure intact.

2. **Apply the security rules from step 1**: In Firebase Console, paste `firestore.rules` into
   Firestore → Rules, and `database.rules.json` into Realtime Database → Rules. Publish both.

3. **Connect to Vercel**: New Project → Import the `mytripraja-chat` GitHub repo → framework
   preset "Vite" (auto-detected).

4. **Add environment variables in Vercel**: Project Settings → Environment Variables. Copy the
   values from your existing MyTripRaja Firebase project's config (same values used in your other
   `.env` files) into the variables listed in `.env.example`. `VITE_FIREBASE_DATABASE_URL` is the
   Realtime Database URL — enable Realtime Database in Firebase Console first if you haven't
   already, since it's a separate product from Firestore.

5. **Add the subdomain**: In Vercel, Project Settings → Domains → add `chat.mytripraja.com`.
   Vercel will show you a CNAME record to add. Add that CNAME wherever mytripraja.com's DNS is
   currently managed (same place you set up the other subdomains like calendar.mytripraja.com).

6. **Deploy**: Vercel builds automatically on push. First deploy should show the "Not signed in"
   placeholder, confirming Firebase is wired up correctly.

7. **Plug in your existing MyTripRaja auth**: `App.jsx` currently just checks `onAuthStateChanged`
   and shows a placeholder if nobody's signed in. Swap that placeholder for whatever sign-in flow
   (Google login, phone OTP, etc.) you're already using elsewhere in MyTripRaja — since it's the
   same Firebase project, an already-signed-in user from another MyTripRaja app will show up here
   signed in too.

## Firestore composite index
The chat list query (`src/lib/chats.js`) filters by `participants` and orders by
`lastMessageTime`, which needs a composite index. The first time you load the chat list in a
browser, open the console — Firestore will print a direct link to create the index with one
click. Do this once per environment.

## What's built so far
- Chat list (`/`), new chat by email (`/new`), and message thread (`/chat/:chatId`) — all wired to
  real-time Firestore listeners
- Sending, read receipts, and auto-scroll to newest message

## What's next
Plug in real auth (see step 7 above), then WebRTC voice/video calling — a "Call" button will be
added to the chat thread header.
