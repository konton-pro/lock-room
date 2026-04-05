export const serverConfig = {
  port: Number(process.env.PORT ?? 3000),
  maxRequestsPerMinute: Number(process.env.MAX_REQUESTS_PER_MINUTE ?? 100),
  maxAuthRequestsPerMinute: Number(process.env.MAX_AUTH_REQUESTS_PER_MINUTE ?? 5),
  isProduction: process.env.NODE_ENV === "production",
};
