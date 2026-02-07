import { ChatSession } from "./chatSession";

function withCors(resp: Response) {
  const headers = new Headers(resp.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  return new Response(resp.body, {
    status: resp.status,
    headers,
  });
}

export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return withCors(new Response(null, { status: 204 }));
    }

    if (url.pathname === "/api/health") {
      return withCors(new Response("ok"));
    }

    if (url.pathname === "/api/chat" && request.method === "POST") {
      const body = await request.json().catch(() => ({}));
      const message = String(body.message ?? "");
      const sessionId = String(body.sessionId ?? "default");

      if (!message) {
        return withCors(
          Response.json({ error: "Missing message" }, { status: 400 })
        );
      }

      const id = env.CHAT_SESSION.idFromName(sessionId);
      const stub = env.CHAT_SESSION.get(id);

      const resp = await stub.fetch("https://do/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, sessionId }),
      });

      return withCors(resp);
    }

    return withCors(new Response("Not found", { status: 404 }));
  },
};

export { ChatSession };
