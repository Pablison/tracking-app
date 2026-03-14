import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    // Remove aspas e espaços que possam vir na URL (ex: token='')   
    const rawToken = searchParams.get("token");
    const token = rawToken ? rawToken.replace(/['"`]/g, "").trim() : null;

    if (!token) {
        return NextResponse.json({ message: "Token inválido ou ausente." }, { status: 400 });
    }

    try {
        const protheusUser = process.env.PROTHEUS_REST_USER;
        const protheusPass = process.env.PROTHEUS_REST_PASS;
        const protheusUrl = process.env.PROTHEUS_REST_URL || "http://189.26.114.132:8087";

        if (!protheusUser || !protheusPass) {
            console.error("Variaveis de ambiente do ERP ausentes no servidor web!");
        }

        const credentials = Buffer.from(`${protheusUser || 'admin'}:${protheusPass || 'senha'}`).toString("base64");

        // Tratamento para não duplicar o /rest se caso o usuário colocar na ENV
        const baseUrl = protheusUrl.endsWith('/') ? protheusUrl.slice(0, -1) : protheusUrl;
        const apiPath = baseUrl.endsWith('/rest') ? '/api/ft/v1/romaneios/receipt' : '/rest/api/ft/v1/romaneios/receipt';

        // BFF: Rota GET do Protheus que valida o token e retorna os dados do romaneio para exibir em tela
        const response = await fetch(`${baseUrl}${apiPath}?token=${token}`, {
            method: "GET",
            headers: {
                "Authorization": `Basic ${credentials}` // Autenticado com chaves do servidor
            },
            cache: "no-store" // Garante dados sempre frescos
        });

        const data = await response.json();

        console.log("STATUS PROTHEUS OBTIDO:", response.status);
        console.log("PAYLOAD PROTHEUS:", data);

        if (response.ok) {
            // A refatoração do AdvPL colocou os dados reais dentro da chave "data", então precisamos desempacotar:
            return NextResponse.json(data.data ? data.data : data);
        } else {
            return NextResponse.json({ message: data.message || "Erro retornado pelo ERP." }, { status: response.status });
        }

    } catch (error) {
        console.error("Erro BFF Next.js GET (Romaneio Info) route:", error);
        return NextResponse.json({ message: "Erro de comunicação com os servidores." }, { status: 500 });
    }
}
