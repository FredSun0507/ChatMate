export async function POST(req) {
  const HF_TOKEN = process.env.HF_TOKEN; // secure from Render secrets
  const body = await req.json();

  return await fetch(
    "https://fredericksundeep-chatmateapi.hf.space/chat-stream",
    {
      method: "POST",
      headers: { Authorization: `Bearer ${HF_TOKEN}` },
      body: JSON.stringify({ message: body.message, history: body.history }),
    }
  );
}
