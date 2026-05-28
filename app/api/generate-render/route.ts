import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt requerido" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key no configurada en el servidor" }, { status: 500 });
    }

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-image-2",
        prompt: prompt,
        n: 1,
        size: "1536x1024",
        quality: "high",
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("OpenAI error:", err);
      return NextResponse.json(
        { error: err.error?.message || "Error generando imagen" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // gpt-image-2 devuelve base64 por defecto
    const b64 = data.data?.[0]?.b64_json;
    const imageUrl = data.data?.[0]?.url;

    if (b64) {
      return NextResponse.json({ url: `data:image/png;base64,${b64}` });
    } else if (imageUrl) {
      return NextResponse.json({ url: imageUrl });
    } else {
      return NextResponse.json({ error: "No se recibió imagen" }, { status: 500 });
    }

  } catch (error) {
    console.error("Error en generate-render:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
