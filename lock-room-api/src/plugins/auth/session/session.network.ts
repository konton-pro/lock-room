import { sessionConfig } from "@configs/session.config";
import * as ipaddr from "ipaddr.js";
import { UNKNOWN_VALUE } from "@plugins/auth/session/session.constants";
import type {
  SessionIpAddress,
  SessionNetworkConfig,
} from "@plugins/auth/session/session.network.types";

export class SessionNetworkService {
  protected static readonly IPV4_SEGMENT_BITS = 8;
  protected static readonly IPV6_SEGMENT_BITS = 16;
  protected static readonly IPV4_TOTAL_BITS = 32;
  protected static readonly IPV6_TOTAL_BITS = 128;

  constructor(protected readonly config: SessionNetworkConfig) {}

  extractIp(request: Request): string {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded)
      return this.sanitizeIpCandidate(forwarded.split(",")[0] ?? UNKNOWN_VALUE);

    return this.sanitizeIpCandidate(
      request.headers.get("x-real-ip") ?? UNKNOWN_VALUE,
    );
  }

  toSubnet(ip: string): string {
    const address = this.parseAddress(ip);
    if (!address) return UNKNOWN_VALUE;

    return this.isIpv4Address(address)
      ? this.toIpv4Subnet(address)
      : this.toIpv6Subnet(address);
  }

  resolveSubnet(request: Request): string {
    return this.toSubnet(this.extractIp(request));
  }

  protected clampPrefix(value: number, max: number): number {
    return Math.max(0, Math.min(max, Math.floor(value)));
  }

  protected applyMask(
    segments: number[],
    prefix: number,
    segmentBits: number,
  ): number[] {
    let remaining = prefix;

    return segments.map((segment) => {
      if (remaining <= 0) return 0;
      if (remaining >= segmentBits) {
        remaining -= segmentBits;
        return segment;
      }

      const shift = segmentBits - remaining;
      const mask = ((1 << remaining) - 1) << shift;
      remaining = 0;

      return segment & mask;
    });
  }

  protected sanitizeIpCandidate(value: string): string {
    const trimmed = value.trim();
    if (!trimmed) return UNKNOWN_VALUE;

    if (trimmed.startsWith("[") && trimmed.includes("]"))
      return trimmed.slice(1, trimmed.indexOf("]"));

    if (trimmed.includes(".") && trimmed.includes(":")) {
      const [host, port] = trimmed.split(":");
      if (host && port && /^\d+$/.test(port)) return host;
    }

    return trimmed;
  }

  protected toIpv4Subnet(address: ipaddr.IPv4): string {
    const prefix = this.clampPrefix(
      this.config.ipv4SubnetBits,
      SessionNetworkService.IPV4_TOTAL_BITS,
    );
    const subnet = this.applyMask(
      address.octets,
      prefix,
      SessionNetworkService.IPV4_SEGMENT_BITS,
    ).join(".");

    return `${subnet}/${prefix}`;
  }

  protected toIpv6Subnet(address: ipaddr.IPv6): string {
    const prefix = this.clampPrefix(
      this.config.ipv6SubnetBits,
      SessionNetworkService.IPV6_TOTAL_BITS,
    );
    const subnet = this.applyMask(
      address.parts,
      prefix,
      SessionNetworkService.IPV6_SEGMENT_BITS,
    )
      .map((part) => part.toString(16).padStart(4, "0"))
      .join(":");

    return `${subnet}/${prefix}`;
  }

  protected parseAddress(ip: string): SessionIpAddress | null {
    const normalized = this.sanitizeIpCandidate(ip);
    if (
      normalized === UNKNOWN_VALUE ||
      (!normalized.includes(".") && !normalized.includes(":")) ||
      !ipaddr.isValid(normalized)
    )
      return null;

    return ipaddr.process(normalized);
  }

  protected isIpv4Address(address: SessionIpAddress): address is ipaddr.IPv4 {
    return "octets" in address;
  }
}

const sessionNetworkService = new SessionNetworkService({
  ipv4SubnetBits: sessionConfig.ipv4SubnetBits,
  ipv6SubnetBits: sessionConfig.ipv6SubnetBits,
});

export const extractIp = (request: Request): string =>
  sessionNetworkService.extractIp(request);

export const toSubnet = (ip: string): string =>
  sessionNetworkService.toSubnet(ip);

export const resolveSubnet = (request: Request): string =>
  sessionNetworkService.resolveSubnet(request);
