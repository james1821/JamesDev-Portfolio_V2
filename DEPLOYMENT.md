# Deployment

## 1. Create the Firebase project

1. [console.firebase.google.com](https://console.firebase.google.com) → **Add project**.
2. **Build → Authentication → Get started → Google** → enable → save.
3. **Build → Firestore Database → Create database** → production mode → pick a region.
4. **Build → Storage → Get started** → same region.

## 2. Collect the credentials

**Web config** → Project settings → General → Your apps → Web (`</>`). Copy the
six values into the `NUXT_PUBLIC_FIREBASE_*` variables.

**Service account** → Project settings → Service accounts → **Generate new
private key**. From the downloaded JSON take `project_id`, `client_email` and
`private_key` into `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` and
`FIREBASE_PRIVATE_KEY`.

> Keep `FIREBASE_PRIVATE_KEY` wrapped in double quotes with its `\n` escapes
> intact. `server/utils/firebaseAdmin.ts` converts them back to real newlines.
> Delete the downloaded JSON once the values are in your host — it is a
> full-access credential.

## 3. Publish the security rules

Both rule files are in the repo root. Either paste them into the console
(Firestore → Rules, Storage → Rules) or use the CLI:

```bash
npm install -g firebase-tools
firebase login
firebase use --add            # select your project
firebase deploy --only firestore:rules,storage:rules
```

**Publish these before the first sign-in.** Without them Firestore starts in
locked mode and the admin claim cannot be written.

## 4. Get an OpenRouter key

[openrouter.ai/keys](https://openrouter.ai/keys) — free, no card required. Set
`OPENROUTER_API_KEY`. Leave `OPENROUTER_MODEL` empty to use the fallback chain.

## 5. Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Nuxt is detected automatically; no build settings to change. Then add every
variable from `.env.example` under **Settings → Environment Variables**, for
Production, Preview and Development. Redeploy so the build picks them up.

### Netlify

Same flow. Build command `npm run build`, publish directory `dist`. Add the
environment variables under Site configuration → Environment variables.

### Anywhere with Node

```bash
npm run build
node .output/server/index.mjs
```

Set the same variables in the process environment. The build output is a
standalone Nitro server with no runtime dependency on `node_modules`.

## 6. Authorise your domain

Firebase Authentication → Settings → **Authorised domains** → add your
production domain. Google sign-in fails silently without this, and it is the
single most common cause of a popup that opens and immediately closes.

## 7. Claim the dashboard

Visit `https://your-domain.com/admin` and sign in with the Google account that
should own the site. **The first account to do this owns it permanently** — do
this yourself before sharing the URL.

Then on the overview screen press **Import starter content** to populate
Firestore, and edit from there.

## Post-deploy checks

- [ ] `/` renders your content, not the starter fallback
- [ ] `/admin` refuses a second Google account
- [ ] Uploading a JPG in Projects returns a `firebasestorage.googleapis.com` URL
- [ ] Replacing the resume changes every Resume button
- [ ] The assistant answers, and cuts off after five questions
- [ ] `/robots.txt` disallows `/admin`

## Transferring ownership

There is deliberately no UI for this. Delete `config/admin` in the Firestore
console; the next Google account to open `/admin` claims the site.

## Optional: correcting the Git author email

Your existing 25 commits carry `jamesespinosamark.com` — missing its `@`, so
GitHub cannot link them to your account. The local repo is now configured
correctly, so **new** commits are fine.

Rewriting the old ones changes every commit SHA. Only do this if you are
comfortable force-pushing:

```bash
git filter-repo --email-callback '
  return b"jamesespinosamark@gmail.com" if email == b"jamesespinosamark.com" else email
'
git push --force-with-lease
```

If the repo is already shared or forked, leaving history alone is the safer choice.
