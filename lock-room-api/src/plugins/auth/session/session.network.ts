import { sessionConfig } from "@configs/session.config";
import { UNKNOWN_VALUE } from "@plugins/auth/session/session.constants";

const expandIpv6 = (value: string): string[] => {
  const [headRaw, tailRaw] = value.toLowerCase().split("::");
  const head = headRaw ? headRaw.split(":").filter(Boolean) : [];

  const tail = tailRaw ? tailRaw.split(":").filter(Boolean) : [];

  const missing = Math.max(0, 8 - (head.length + tail.length));
  
  return [...head, ...Array.from({ length: missing }, () => "0"), ...tail].map(
    (part) => part.padStart(4, "0"),
  );
};

const stripPortAndBrackets = (value: string): string => {
  if (value.startsWith("[") && value.includes("]"))
    return value.slice(1, value.indexOf("]"));

  const parts = value.split(":");
  if (parts.length === 2 && parts.every((part) => part.length > 0))
    return parts[0] ?? value;

  return value;
};

const toIpv4Subnet = (ip: string): string => {
  const octets = ip.split(".");
  if (octets.length !== 4) return UNKNOWN_VALUE;

  const networkOctets = Math.floor(sessionConfig.ipv4SubnetBits / 8);
  const subnet = octets
    .map((octet, index) => (index < networkOctets ? octet : "0"))
    .join(".");

  return `${subnet}/${sessionConfig.ipv4SubnetBits}`;
};

const toIpv6Subnet = (ip: string): string => {
  const mappedIpv4 = ip.includes(".") ? ip.split(":").pop() : null;
  if (mappedIpv4) return toIpv4Subnet(mappedIpv4);

  const expanded = expandIpv6(ip);
  const networkGroups = Math.floor(sessionConfig.ipv6SubnetBits / 16);
  const subnet = expanded
    .map((group, index) => (index < networkGroups ? group : "0000"))
    .join(":");

  return `${subnet}/${sessionConfig.ipv6SubnetBits}`;
};

export const extractIp = (request: Request): string => {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return stripPortAndBrackets(forwarded.split(",")[0]?.trim() ?? UNKNOWN_VALUE);

  return stripPortAndBrackets(request.headers.get("x-real-ip")?.trim() ?? UNKNOWN_VALUE);
};

export const toSubnet = (ip: string): string => {
  if (ip.includes(".")) return toIpv4Subnet(ip);
  if (ip.includes(":")) return toIpv6Subnet(ip);
  return UNKNOWN_VALUE;
};

export const resolveSubnet = (request: Request): string => toSubnet(extractIp(request));
