import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt requerido" }, { status: 400 });
    }
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key no configurada" }, { status: 500 });
    }
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: `Architectural visualization render: ${prompt}. Photorealistic exterior render, golden hour lighting, professional architectural photography style, high detail, 4K quality.`,
        n: 1, size: "1792x1024", quality: "standard", style: "natural",
      }),
    });
    if (!response.ok) {
      const err = await response.json();
      return NextResponse.json({ error: err.error?.message || "Error generando imagen" }, { status: response.status });
    }
    const data = await response.json();
    const imageUrl = data.data?.[0]?.url;
    if (!imageUrl) return NextResponse.json({ error: "No se recibió imagen" }, { status: 500 });
    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error("Error en generate-render:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
