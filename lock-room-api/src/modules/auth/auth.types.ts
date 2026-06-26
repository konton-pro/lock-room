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

export type SessionInput = {
  userCuid: string;
  sessionIdHash: string;
  ipSubnet: string;
  userAgentHash: string;
  expiresAt: Date;
};
