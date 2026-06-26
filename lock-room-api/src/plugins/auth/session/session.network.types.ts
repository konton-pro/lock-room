import type * as ipaddr from "ipaddr.js";

export type SessionNetworkConfig = {
  ipv4SubnetBits: number;
  ipv6SubnetBits: number;
};

export type SessionIpAddress = ipaddr.IPv4 | ipaddr.IPv6;
