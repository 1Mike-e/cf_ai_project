import { ChatSession } from "./chatSession";

export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);

    // Basic health check
    if (url.pathname === "/api/health") {
      return new Response("ok");
    }

    // Chat endpoint (routes to Durable Object for memory/state)
    if (url.pathname === "/api/chat" && request.method === "POST") {
      const body = await request.json().catch(() => ({}));
      const message = String(body.message ?? "");
      const sessionId = String(body.sessionId ?? "default");

      if (!message) {
        return Response.json(
          { error: "Missing 'message' in request body" },
          { status: 400 }
        );
      }

      // Route to the DO instance for this session
      const id = env.CHAT_SESSION.idFromName(sessionId);
      const stub = env.CHAT_SESSION.get(id);

      // Forward the same request body to the DO
      return stub.fetch("https://do/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, sessionId }),
      });
    }

    return new Response("Not found", { status: 404 });
  },
};

// Required so Cloudflare can construct the Durable Object class
export { ChatSession };
