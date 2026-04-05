export const toBase64 = (buffer: ArrayBuffer): string =>
  btoa(String.fromCharCode(...new Uint8Array(buffer)))

export const fromBase64 = (base64: string): ArrayBuffer =>
  Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)).buffer as ArrayBuffer

export const toHex = (buffer: ArrayBuffer): string =>
  [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('')

export const hexToBytes = (hex: string): Uint8Array<ArrayBuffer> =>
  new Uint8Array(hex.match(/.{2}/g)!.map((h) => parseInt(h, 16))) as Uint8Array<ArrayBuffer>
