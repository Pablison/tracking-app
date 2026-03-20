import { ConfirmReceiptPayload, RomaneioData } from "@/lib/types/romaneio";

interface ProtheusResponse {
  message?: string;
  data?: RomaneioData;
}

interface ProtheusConfig {
  apiUrl: string;
  authorization: string;
}

function sanitizeUrlForLog(url: string): string {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.searchParams.has("token")) {
      parsedUrl.searchParams.set("token", "***");
    }

    return parsedUrl.toString();
  } catch {
    return url.replace(/token=[^&]+/i, "token=***");
  }
}

function buildApiUrl(baseUrl: string): string {
  const normalizedBaseUrl = baseUrl.endsWith("/")
    ? baseUrl.slice(0, -1)
    : baseUrl;
  return `${normalizedBaseUrl}/api/ft/v1/romaneios/receipt`;
}

function getProtheusConfig(): ProtheusConfig {
  const user = process.env.PROTHEUS_REST_USER;
  const password = process.env.PROTHEUS_REST_PASS;
  const baseUrl = process.env.PROTHEUS_REST_URL;

  if (!user || !password || !baseUrl) {
    console.error("[protheus] Missing environment variables.", {
      hasUser: Boolean(user),
      hasPassword: Boolean(password),
      hasBaseUrl: Boolean(baseUrl),
    });
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

async function fetchWithProtheusLogs(
  input: string,
  init: RequestInit,
): Promise<Response> {
  const startedAt = Date.now();
  const method = init.method ?? "GET";
  const sanitizedUrl = sanitizeUrlForLog(input);

  try {
    return await fetch(input, init);
  } catch (error) {
    console.error("[protheus] Request failed.", {
      url: sanitizedUrl,
      method,
      durationMs: Date.now() - startedAt,
      error,
    });

    throw error;
  }
}

export async function getRomaneioByToken(token: string): Promise<{
  status: number;
  data?: RomaneioData;
  message?: string;
}> {
  const { apiUrl, authorization } = getProtheusConfig();
  const requestUrl = `${apiUrl}?token=${encodeURIComponent(token)}`;

  const response = await fetchWithProtheusLogs(
    requestUrl,
    {
      method: "GET",
      headers: {
        Authorization: authorization,
      },
      cache: "no-store",
    },
  );

  const payload = await parseJsonResponse<ProtheusResponse>(response);

  if (!response.ok) {
    console.error("[protheus] ERP returned error for romaneio query.", {
      url: sanitizeUrlForLog(requestUrl),
      status: response.status,
      message: payload?.message ?? null,
    });

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

  const response = await fetchWithProtheusLogs(
    apiUrl,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify(payload),
    },
  );

  const responseBody = await parseJsonResponse<ProtheusResponse>(response);

  if (!response.ok) {
    console.error("[protheus] ERP returned error for receipt confirmation.", {
      url: sanitizeUrlForLog(apiUrl),
      status: response.status,
      message: responseBody?.message ?? null,
    });

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
