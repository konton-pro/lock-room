import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { cryptoConfig } from "@configs/crypto.config";
import { ALGORITHM, IV_LENGTH } from "@plugins/crypto/server-crypto/server-crypto.constants";

export const encrypt = (buffer: Buffer) => {
  const iv = randomBytes(IV_LENGTH);
  
  const cipher = createCipheriv(ALGORITHM, cryptoConfig.masterKey, iv);
  
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  
  const tag = cipher.getAuthTag();
  
  return { encrypted, iv, tag };
};

export const decrypt = (encrypted: Buffer, iv: Buffer, tag: Buffer) => {
  const decipher = createDecipheriv(ALGORITHM, cryptoConfig.masterKey, iv);

  decipher.setAuthTag(tag);
  
  return Buffer.concat([decipher.update(encrypted), decipher.final()]);
};
