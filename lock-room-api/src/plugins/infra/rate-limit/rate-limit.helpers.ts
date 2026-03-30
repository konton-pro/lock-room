export const rateLimitHelpers = {
  extractUserId(req: Request): string | null {
    try {
      const token = req.headers.get("authorization")?.replace("Bearer ", "");
      
      if (!token) return null;
      
      const payload = token.split(".")[1];
      
      if (!payload) return null;
      
      const decoded = JSON.parse(Buffer.from(payload, "base64url").toString());
      
      return (decoded.sub as string) ?? null;
      
    } catch {
      return null;
    }
  },

  extractIp(req: Request): string {
    return (
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("x-real-ip") ??
      "unknown"
    );
  },

  generateKey(req: Request): string {
    return this.extractUserId(req) ?? this.extractIp(req);
  },
};
