export type EncryptedLayer = {
  encrypted: Buffer;
  iv: Buffer;
  tag: Buffer;
};

export type ServerCrypto = {
  encrypt: (buffer: Buffer) => EncryptedLayer;
  decrypt: (encrypted: Buffer, iv: Buffer, tag: Buffer) => Buffer;
};

export type StoreVaultInput = {
  encryptedHeader: string;
  encryptedBody: string;
  clientIv: string;
};

export type CreateVaultData = {
  userCuid: string;
  encryptedHeader: Buffer;
  encryptedBody: Buffer;
  clientIv: Buffer;
  serverHeaderIv: Buffer;
  serverHeaderTag: Buffer;
  serverBodyIv: Buffer;
  serverBodyTag: Buffer;
};
