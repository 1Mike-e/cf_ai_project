export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return new Response("ok");
    }

    if (url.pathname === "/api/chat" && request.method === "POST") {
      const { message } = await request.json();

      // temporary: no memory yet, just a single-turn call
      const result = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
        messages: [
          { role: "system", content: "You are a helpful assistant. Keep replies concise." },
          { role: "user", content: String(message ?? "") },
        ],
      });

      // Workers AI usually returns { response: "..." } for chat models
      return Response.json({ reply: result.response ?? result });
    }

    return new Response("Not found", { status: 404 });
  },
};
