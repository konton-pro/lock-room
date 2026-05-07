declare module "ipaddr.js" {
  export type IPv4 = {
    kind(): "ipv4";
    octets: number[];
  };

  export type IPv6 = {
    kind(): "ipv6";
    parts: number[];
  };

  export type Addr = IPv4 | IPv6;

  export function isValid(address: string): boolean;
  export function process(address: string): Addr;
}
