import type { ServerCrypto } from "@modules/vault/vault.types";

export type { ServerCrypto };

export type StoreRecoveryInput = {
  encryptedPayload: string;
  iv: string;
  tag: string;
  recoveryKeyHash: string;
};

export type ResetRecoveryInput = {
  email: string;
  recoveryKeyHash: string;
  newPassword: string;
  newEncryptedPayload: string;
  newIv: string;
  newTag: string;
};

export type CreateRecoveryData = {
  userId: number;
  encryptedPayload: Buffer;
  clientIv: Buffer;
  clientTag: Buffer;
  serverIv: Buffer;
  serverTag: Buffer;
  recoveryKeyHash: string;
};

export type UpdateRecoveryPayload = {
  encryptedPayload: Buffer;
  clientIv: Buffer;
  clientTag: Buffer;
  serverIv: Buffer;
  serverTag: Buffer;
};
