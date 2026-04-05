export type JwtPayload = {
  sub: string;
  email: string;
};

export type MasterKeyData = {
  encryptedMasterKey: string;
  masterKeyIv: string;
  masterKeyTag: string;
  masterKeySalt: string;
};

export type RecoveryKeyData = {
  encryptedPayload: string;
  iv: string;
  tag: string;
  recoveryKeyHash: string;
};
