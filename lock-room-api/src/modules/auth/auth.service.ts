import { ConflictException } from "@exceptions/conflict.exception";
import { UnauthorizedException } from "@exceptions/unauthorized.exception";
import { UnprocessableEntityException } from "@exceptions/unprocessable-entity.exception";
import { authRepository } from "@modules/auth/auth.repository";
import { recoveryRepository } from "@modules/recovery/recovery.repository";
import { AUTH_ERRORS } from "@modules/auth/auth.constants";
import type { JwtPayload, MasterKeyData, RecoveryKeyData } from "@modules/auth/auth.types";
import type { ServerCrypto } from "@modules/recovery/recovery.types";

export const authService = {
  register: async (
    name: string,
    email: string,
    password: string,
    masterKeyData: MasterKeyData,
    recoveryKeyData: RecoveryKeyData,
    crypto: ServerCrypto,
  ) => {
    const existing = await authRepository.findByEmail(email);

    if (existing) throw new ConflictException(AUTH_ERRORS.EMAIL_ALREADY_IN_USE);

    const hashedPassword = await Bun.password.hash(password);
    const user = await authRepository.create(name, email, hashedPassword, masterKeyData);

    const payloadBuffer = Buffer.from(recoveryKeyData.encryptedPayload, "base64");
    const l2 = crypto.encrypt(payloadBuffer);

    await recoveryRepository.upsert({
      userId: user.id,
      encryptedPayload: l2.encrypted,
      clientIv: Buffer.from(recoveryKeyData.iv, "base64"),
      clientTag: Buffer.from(recoveryKeyData.tag, "base64"),
      serverIv: l2.iv,
      serverTag: l2.tag,
      recoveryKeyHash: recoveryKeyData.recoveryKeyHash,
    });

    return user;
  },

  login: async (
    email: string,
    password: string,
  ): Promise<{ jwtPayload: JwtPayload; masterKeyData: MasterKeyData }> => {
    const user = await authRepository.findByEmail(email);

    if (!user) throw new UnauthorizedException(AUTH_ERRORS.INVALID_CREDENTIALS);

    const valid = await Bun.password.verify(password, user.password);

    if (!valid)
      throw new UnauthorizedException(AUTH_ERRORS.INVALID_CREDENTIALS);

    if (
      !user.encryptedMasterKey ||
      !user.masterKeyIv ||
      !user.masterKeyTag ||
      !user.masterKeySalt
    )
      throw new UnprocessableEntityException(AUTH_ERRORS.MISSING_MASTER_KEY);

    return {
      jwtPayload: { sub: user.cuid, email: user.email },
      masterKeyData: {
        encryptedMasterKey: user.encryptedMasterKey,
        masterKeyIv: user.masterKeyIv,
        masterKeyTag: user.masterKeyTag,
        masterKeySalt: user.masterKeySalt,
      },
    };
  },
};
