export type VaultOverrides = {
  encryptedHeader?: Buffer;
  encryptedBody?: Buffer;
  clientIv?: Buffer;
};

export type VaultFactoryResult = {
  cuid: string;
  createdAt: Date;
  updatedAt: Date;
};
