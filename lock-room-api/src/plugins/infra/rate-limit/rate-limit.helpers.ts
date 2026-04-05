export const rateLimitHelpers = {
  async extractUserId(req: Request, jwt?: any): Promise<string | null> {
    try {
      const token = req.headers.get("authorization")?.replace("Bearer ", "");

      if (!token) return null;
      if (!jwt) return null;

      const payload = await jwt.verify(token);
      if (!payload) return null;

      return (payload.sub as string) ?? null;
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

  async generateKey(req: Request, jwt?: any): Promise<string> {
    return (await this.extractUserId(req, jwt)) ?? this.extractIp(req);
  },
};
