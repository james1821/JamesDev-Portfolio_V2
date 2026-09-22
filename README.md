# Mark James Espinosa — Portfolio

Nuxt 4 portfolio with a Firebase-backed CMS and a retrieval-grounded AI assistant.

## Stack

- **Nuxt 4** (Vue 3, TypeScript, Nitro)
- **Tailwind CSS 3** with a project-specific token set
- **Firebase** — Authentication (Google), Firestore, Cloud Storage
- **OpenRouter** for the portfolio assistant

## How the data flows

The public site never loads the Firebase web SDK. Pages render on the server:

```
Visitor ──► Nuxt page ──► /api/content ──► Firebase Admin SDK ──► Firestore
                             (300s SWR cache)
```

The dashboard is the only place the web SDK runs. `/admin/**` is configured
`ssr: false`, so Vite splits the entire SDK into chunks that public visitors
never download. Verified: the homepage ships ~244 KB of JS with no Firebase in it.

```
Admin ──► /admin (SPA) ──► Firebase Web SDK ──► Firestore + Storage
                                (Security Rules enforce admin-only writes)
```

Writes are authorised by Security Rules, not by application code. Even if
someone bypassed the UI entirely, Firestore would reject the write.

## Admin ownership

The dashboard has exactly one authorised account, matched by email — no
claim step, nothing to race. The enforcement lives in the rules, not the app:

```
function isAdmin() {
  return request.auth != null
         && request.auth.token.email_verified == true
         && request.auth.token.email == 'jamesespinosamark@gmail.com';
}
```

Firebase Auth ID tokens carry a verified email claim that Security Rules read
directly — `request.auth.token.email`. Any other Google account can sign in
successfully (Firebase Authentication doesn't know about this restriction) but
every read and write it attempts to `config/*`, `projects`, `experience`,
`skills`, `currentWork` and `certifications` is rejected server-side.

`useAuth.ts` also checks the email client-side, against
`NUXT_PUBLIC_ADMIN_EMAIL`, purely for a fast, friendly "this isn't your
account" screen. That check is not the real security boundary and could be
bypassed by anyone editing the client bundle — the rules above are what
actually matters, which is why the email is hardcoded in both rule files
rather than read from an environment variable Security Rules can't see.

**To change the admin account:** update the email in `firestore.rules`,
`storage.rules`, and `NUXT_PUBLIC_ADMIN_EMAIL`, then republish both rule
files. All three must match.

## Firestore collections

| Path | Written by | Contents |
|---|---|---|
| `config/site` | Admin | Name, role, summary, photo, email, links, resume URL, location, availability |
| `config/assistant` | Admin | `resumeText` — extra knowledge for the assistant |
| `projects` | Admin | `title, description, image, tech[], demo, github, featured, order` |
| `experience` | Admin | `role, company, companyLogo, startDate, endDate, description, tech[], order` |
| `skills` | Admin | `name, category, icon, order` |
| `currentWork` | Admin | `title, description, image, active, order` |
| `certifications` | Admin | `title, issuer, issuerLogo, date, description, link, order` |
| `rateLimits/{sessionId}` | Server only | `count, updatedAt, expiresAt` |
| `rateLimitsByIp/{hash}-{date}` | Server only | `count, expiresAt` |

Both rate-limit collections are `allow read, write: if false` — unreachable from
any client, writable only through the Admin SDK.

### Storage

| Path | Accepts |
|---|---|
| `images/` | JPG, PNG, WebP, GIF — under 5 MB |
| `resume/` | PDF — under 10 MB |

Read is public; write requires the admin claim, with the type and size limits
enforced in `storage.rules` as well as in the upload composable.

## Environment variables

Copy `.env.example` to `.env`. Every variable is listed there with where to find it.

**Public** (safe to expose — Security Rules do the enforcing):
`NUXT_PUBLIC_FIREBASE_API_KEY`, `NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN`,
`NUXT_PUBLIC_FIREBASE_PROJECT_ID`, `NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET`,
`NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NUXT_PUBLIC_FIREBASE_APP_ID`,
`NUXT_PUBLIC_ADMIN_EMAIL`

**Server-only** (never commit):
`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`,
`FIREBASE_STORAGE_BUCKET`, `OPENROUTER_API_KEY`, `OPENROUTER_MODEL` (optional),
`ASSISTANT_QUESTION_LIMIT` (default 5), `SITE_URL`

The site runs without any of them — `/api/content` falls back to
`server/utils/seedContent.ts` so a fresh clone builds and renders.

## Do you need the service account?

Two variables, `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY`, are what let
the Nitro server talk to Firestore. Here is exactly what happens without them,
because `useFirestore()` returns `null` rather than throwing:

| | With the service account | Without |
|---|---|---|
| Public pages | Render your Firestore content | Render the bundled starter content — **your CMS edits never appear** |
| Assistant | 5 per session, 40/day per IP | **No limit at all** — every visitor gets unlimited calls on your key |
| Dashboard | Works | Works — it uses the web SDK, not this |
| Uploads | Work | Work — client-side, public bucket |

So the site does not break, which is the trap: it looks fine and quietly serves
stale content while your assistant burns through your OpenRouter quota. For a
portfolio with a CMS, you want these set.

### If you would rather not hold a private key

There is a real alternative. Firestore has a REST API that reads
publicly-readable documents using only the public web API key:

```
GET https://firestore.googleapis.com/v1/projects/{projectId}/databases/(default)/documents/{collection}?key={publicApiKey}
```

Every content collection in this project is already `allow read: if true`, so
rewriting `/api/content` against that endpoint would keep server-side rendering
and your live content with no private key anywhere.

What it cannot do is the rate limiting. Those counters have to be writable by
the server and by nobody else, and that is precisely what a service account is
for. The fallbacks are worse: a signed `httpOnly` cookie is no harder to clear
than the current `sessionId`, and Nitro's in-memory storage resets on every
serverless cold start.

Ask and I will do the REST-API swap. The honest recommendation is to set the two
variables — it is one paste into your host's environment settings, the key never
touches the repo, and you can rotate it from the Firebase console at any time.

## The assistant

`POST /api/assistant` with `{ message, sessionId }`.

1. Validates the message (1–500 chars) and session id format.
2. Increments two counters inside a Firestore transaction: five per session, and
   a 40/day ceiling per hashed IP. A transaction is used because several tabs
   can fire at once; the IP ceiling exists because a `sessionId` in
   `localStorage` is trivially reset.
3. Builds a system prompt from the live Firestore content plus `resumeText`, and
   instructs the model to answer only from that record.
4. Calls OpenRouter, walking a fallback chain:
   `openai/gpt-oss-20b:free` → `google/gemma-3-27b-it:free` →
   `meta-llama/llama-3.3-70b-instruct:free`.

The chain matters: OpenRouter's free roster rotates without notice, so a single
hard-coded model is a liability. Set `OPENROUTER_MODEL` to pin a preferred model
at the front of the chain.

### Local fallback

If `OPENROUTER_API_KEY` isn't set, or every model in the chain fails, the
server answers from a deterministic keyword matcher in
`server/utils/localAssistant.ts` instead of returning an error. It pattern-matches
the question against the same live content (experience, skills, projects,
contact, resume, availability, certifications, current work) and returns a
templated answer built directly from it — no network call, so it can't itself
be unavailable. The response is marked `"model": "local"` so you can tell
which tier answered, though the UI doesn't currently surface that distinction
to visitors.

This means the assistant always says something useful, even with no
OpenRouter key configured at all — the free-tier AI is an upgrade over the
local bot, not a requirement for the assistant to function.

## Local development

```bash
npm install
cp .env.example .env    # fill in your values
npm run dev
```

Open `http://localhost:3000`, then `http://localhost:3000/admin` and sign in with
Google to claim the dashboard. On the overview screen, **Import starter content**
copies the bundled records into Firestore so you have something to edit.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server on port 3000 |
| `npm run build` | Production build into `.output` |
| `npm run preview` | Serve the production build |
| `npm run typecheck` | `vue-tsc` over the project |
