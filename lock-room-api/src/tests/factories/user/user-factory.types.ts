export type UserOverrides = {
  name?: string;
  email?: string;
  password?: string;
  encryptedMasterKey?: string;
  masterKeyIv?: string;
  masterKeyTag?: string;
  masterKeySalt?: string;
};

export type UserFactoryResult = {
  cuid: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};
