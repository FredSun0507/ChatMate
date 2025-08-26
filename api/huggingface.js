export async function POST(req) {
  const HF_TOKEN = process.env.HF_TOKEN; // secure from Render secrets
  const body = await req.json();

  const response = await fetch(
    "https://fredericksundeep-chatmateapi.hf.space/chat-stream",
    {
      method: "POST",
      headers: { Authorization: `Bearer ${HF_TOKEN}`,
       "Content-Type": "application/json",
     },
      body: JSON.stringify({ message: body.message, history: body.history }),
    }
  );

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
}
