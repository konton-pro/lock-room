export function sanitizeHeaders(headers: Headers): Record<string, string> {
  const result: Record<string, string> = {};
  
  headers.forEach((value, key) => {
    if (key === "authorization") return (result[key] = "[redacted]");
    
    result[key] = value;
  });

  return result;
}

export async function parseBody(request: Request): Promise<unknown> {
  const contentType = request.headers.get("content-type") ?? "";
  
  if (!contentType.includes("application/json")) return null;

  try {
    return await request.clone().json();
  } catch {
    return null;
  }
}
