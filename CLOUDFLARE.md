# Coloring Book Studio — Cloudflare Workers

Cloudflare currently recommends **vinext** for existing Next.js applications on Workers.

## Non-destructive migration

Keep the existing Next.js/Vercel configuration while validating Cloudflare.

From a local clone of this repository:

```bash
npx vinext check
npx vinext init
```

Choose **Cloudflare Workers** when prompted. The initializer adds the Cloudflare/Vite configuration and vinext scripts while leaving the existing Next.js workflow available.

Then verify:

```bash
npm run dev:vinext
npm run build:vinext
```

Deploy after the compatibility check and build pass:

```bash
npx @vinext/cloudflare deploy
```

## Required Cloudflare variables

Configure these for the Worker / Workers Build:

- `NEXT_PUBLIC_SUPABASE_URL` — configuration variable
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — configuration variable
- `OPENAI_TEXT_MODEL` — configuration variable
- `OPENAI_API_KEY` — **Secret**

Never commit the OpenAI key, `.dev.vars`, or `.env` files.

The Supabase service-role/secret key is not required by the browser application and must never be exposed client-side.

## Architecture

Cloudflare Workers → Next.js/vinext application → Supabase Auth/Postgres/Storage → OpenAI

The existing Vercel deployment can remain available until Cloudflare has passed login, authenticated navigation, Server Actions, AI planner, prompt generation, and Supabase RLS tests.
