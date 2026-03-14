import { NextRequest, NextResponse } from "next/server";

import { getRomaneioByToken } from "@/lib/server/protheus-client";
import { sanitizeToken } from "@/lib/utils/sanitize-token";

export async function GET(req: NextRequest) {
  const token = sanitizeToken(req.nextUrl.searchParams.get("token"));

  if (!token) {
    return NextResponse.json(
      { message: "Token invalido ou ausente." },
      { status: 400 },
    );
  }

  try {
    const result = await getRomaneioByToken(token);

    if (!result.data) {
      return NextResponse.json(
        { message: result.message || "Romaneio nao encontrado." },
        { status: result.status },
      );
    }

    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    console.error("Erro ao consultar romaneio no Protheus:", error);

    return NextResponse.json(
      { message: "Erro de comunicacao com os servidores." },
      { status: 500 },
    );
  }
}
