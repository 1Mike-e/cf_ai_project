export class ChatSession {
  state: DurableObjectState;
  env: any;

  constructor(state: DurableObjectState, env: any) {
    this.state = state;
    this.env = env;
  }

  async fetch(request: Request): Promise<Response> {
    const body = await request.json().catch(() => ({}));
    const message = String(body.message ?? "");

    if (!message) {
      return Response.json({ error: "Missing 'message'" }, { status: 400 });
    }

    const history = (await this.state.storage.get<any[]>("history")) ?? [];
    history.push({ role: "user", content: message });

    const result = await this.env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        ...history,
      ],
    });

    const reply = result?.response ?? String(result ?? "");
    history.push({ role: "assistant", content: reply });

    await this.state.storage.put("history", history);

    return Response.json({ reply });
  }
}
