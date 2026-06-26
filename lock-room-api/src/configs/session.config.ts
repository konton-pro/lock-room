const ttlDays = Number(process.env.SESSION_TTL_DAYS ?? 7);

export const sessionConfig = {
  cookieName: process.env.SESSION_COOKIE_NAME ?? "lock_room_session",
  ttlDays,
  ttlMs: ttlDays * 24 * 60 * 60 * 1000,
  secureCookie: process.env.NODE_ENV === "production",
  ipv4SubnetBits: Number(process.env.SESSION_IPV4_SUBNET_BITS ?? 24),
  ipv6SubnetBits: Number(process.env.SESSION_IPV6_SUBNET_BITS ?? 64),
};
