# cf_ai_project

An AI-powered chat application built on Cloudflare that uses Workers AI for LLM inference and Durable Objects for per-session memory. The app provides a browser-based chat interface deployed with Cloudflare Pages.

## Architecture

Pages UI → Worker API → Durable Object (chat memory/state) → Workers AI (LLM)

- **Cloudflare Pages**: Static chat UI
- **Cloudflare Worker**: API layer (`/api/chat`)
- **Durable Objects**: Per-session conversation memory
- **Workers AI**: LLM inference (Llama instruct model)

## Features

- Stateless frontend with persistent server-side memory
- Session-based chat using Durable Objects
- Deployed globally on Cloudflare’s edge
- Simple REST API for chat interactions

## Setup

### Prerequisites

- Node.js (LTS)
- Cloudflare account
- Wrangler CLI (`npm install -g wrangler`)

### Run locally

```bash
cd worker/cf-ai-worker
wrangler dev
# cf_ai_project
```

### Deploy

```bash
cd worker/cf-ai-worker
wrangler deploy
```

### Deploy the frontend

- Create a Cloudflare Pages project
- Connect this GitHub repo
- Set:

  Framework preset: None

  Build command: (empty)

  Output directory: web

### Usage

- Open the Cloudflare Pages URL
- Type a message into the chat interface
- Conversation state persists across messages using a session ID
- Refreshing the page keeps the same session unless reset
