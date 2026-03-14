import { NextRequest, NextResponse } from "next/server";

import { confirmReceipt } from "@/lib/server/protheus-client";
import { sanitizeToken } from "@/lib/utils/sanitize-token";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = sanitizeToken(body.token);
    const recipientName =
      typeof body.recipientName === "string" ? body.recipientName.trim() : "";
    const observation =
      typeof body.observation === "string" ? body.observation.trim() : "";

    if (!token) {
      return NextResponse.json(
        { message: "Token invalido." },
        { status: 400 },
      );
    }

    if (!recipientName) {
      return NextResponse.json(
        { message: "Nome do recebedor e obrigatorio." },
        { status: 400 },
      );
    }

    const result = await confirmReceipt({
      token,
      recipientName,
      observation,
    });

    return NextResponse.json(
      { message: result.message },
      { status: result.status },
    );
  } catch (error) {
    console.error("Erro ao confirmar recebimento:", error);

    return NextResponse.json(
      { message: "Erro de rede no servidor de proxy." },
      { status: 500 },
    );
  }
}
