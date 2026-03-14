import { ConfirmReceiptPayload, RomaneioData } from "@/lib/types/romaneio";

interface ProtheusResponse {
  message?: string;
  data?: RomaneioData;
}

interface ProtheusConfig {
  apiUrl: string;
  authorization: string;
}

function buildApiUrl(baseUrl: string): string {
  const normalizedBaseUrl = baseUrl.endsWith("/")
    ? baseUrl.slice(0, -1)
    : baseUrl;

  const path = normalizedBaseUrl.endsWith("/rest")
    ? "/api/ft/v1/romaneios/receipt"
    : "/rest/api/ft/v1/romaneios/receipt";

  return `${normalizedBaseUrl}${path}`;
}

function getProtheusConfig(): ProtheusConfig {
  const user = process.env.PROTHEUS_REST_USER;
  const password = process.env.PROTHEUS_REST_PASS;
  const baseUrl = process.env.PROTHEUS_REST_URL;

  if (!user || !password || !baseUrl) {
    throw new Error("Protheus environment variables are missing.");
  }

  const authorization = Buffer.from(`${user}:${password}`).toString("base64");

  return {
    apiUrl: buildApiUrl(baseUrl),
    authorization: `Basic ${authorization}`,
  };
}

async function parseJsonResponse<T>(response: Response): Promise<T | null> {
  const text = await response.text();

  if (!text.trim()) {
    return null;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export async function getRomaneioByToken(token: string): Promise<{
  status: number;
  data?: RomaneioData;
  message?: string;
}> {
  const { apiUrl, authorization } = getProtheusConfig();

  const response = await fetch(`${apiUrl}?token=${encodeURIComponent(token)}`, {
    method: "GET",
    headers: {
      Authorization: authorization,
    },
    cache: "no-store",
  });

  const payload = await parseJsonResponse<ProtheusResponse>(response);

  if (!response.ok) {
    return {
      status: response.status,
      message: payload?.message || "Erro retornado pelo ERP.",
    };
  }

  return {
    status: response.status,
    data: payload?.data ?? (payload as RomaneioData | null) ?? undefined,
  };
}

export async function confirmReceipt(
  payload: ConfirmReceiptPayload,
): Promise<{
  status: number;
  message: string;
}> {
  const { apiUrl, authorization } = getProtheusConfig();

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authorization,
    },
    body: JSON.stringify(payload),
  });

  const responseBody = await parseJsonResponse<ProtheusResponse>(response);

  if (!response.ok) {
    return {
      status: response.status,
      message: responseBody?.message || "Erro retornado pelo ERP.",
    };
  }

  return {
    status: response.status,
    message:
      responseBody?.message || "Recebimento gravado com sucesso no ERP.",
  };
}
