import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { recipientName, observation } = body;

        // Remove aspas e espaços que possam vir na requisição (ex: token='')
        const rawToken = body.token;
        const token = rawToken ? String(rawToken).replace(/['\"`]/g, "").trim() : null;

        if (!token) {
            return NextResponse.json({ message: "Token inválido." }, { status: 400 });
        }

        // BFF: Fazendo a ponte segura para o Protheus (Internal API)
        // Isso roda no servidor Node.js, escondendo o IP real do ERP e protegendo a senha.
        const protheusUser = process.env.PROTHEUS_REST_USER;
        const protheusPass = process.env.PROTHEUS_REST_PASS;
        // Exemplo: http://protheusweb.fiscaltech.com.br:8087
        const protheusUrl = process.env.PROTHEUS_REST_URL || "http://189.26.114.132:8087";

        if (!protheusUser || !protheusPass) {
            console.error("Variaveis de ambiente do ERP ausentes no servidor web!");
        }

        const credentials = Buffer.from(`${protheusUser || 'admin'}:${protheusPass || 'senha'}`).toString("base64");

        const baseUrl = protheusUrl.endsWith('/') ? protheusUrl.slice(0, -1) : protheusUrl;
        const apiPath = baseUrl.endsWith('/rest') ? '/api/ft/v1/romaneios/receipt' : '/rest/api/ft/v1/romaneios/receipt';

        const response = await fetch(`${baseUrl}${apiPath}`, {
            method: "POST", // Bate na rota restrita do AdvPL (@Post)
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${credentials}` // Autenticado! (Security=1 passa livre)
            },
            body: JSON.stringify({ token, recipientName, observation }), // Repassando nome e observação
        });

        // Parse do body com segurança — o Protheus pode retornar body vazio ou malformado
        let data: Record<string, unknown> = {};
        try {
            const text = await response.text();
            if (text && text.trim().length > 0) {
                data = JSON.parse(text);
            }
        } catch (parseErr) {
            console.warn("Aviso: body da resposta do Protheus não é JSON válido. Status HTTP:", response.status);
        }

        // Log para diagnóstico
        console.log(">>> CONFIRM RECEIPT | status Protheus:", response.status, "| data:", data);

        if (response.ok) {
            // Mesmo sem body válido, se o status for 2xx, o ERP processou com sucesso
            return NextResponse.json({ message: (data.message as string) || "Recebimento gravado com sucesso no ERP." });
        } else {
            return NextResponse.json({ message: (data.message as string) || "Erro retornado pelo ERP." }, { status: 400 });
        }

    } catch (error) {
        console.error("Erro BFF Next.js route:", error);
        return NextResponse.json({ message: "Erro de rede no servidor de proxy." }, { status: 500 });
    }
}
