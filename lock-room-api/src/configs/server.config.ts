export const serverConfig = {
  port: Number(process.env.PORT ?? 3000),
  maxRequestsPerMinute: Number(process.env.MAX_REQUESTS_PER_MINUTE ?? 100),
  isProduction: process.env.NODE_ENV === "production",
};
