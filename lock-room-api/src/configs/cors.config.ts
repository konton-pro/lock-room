export const corsConfig = {
  allowedOrigins: process.env.CORS_ALLOWED_ORIGINS?.split(",") ?? ["*"],
};
