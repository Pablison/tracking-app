export function sanitizeToken(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  return value.replace(/['"`]/g, "").trim() || null;
}
