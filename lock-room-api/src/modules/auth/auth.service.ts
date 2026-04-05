import { ConflictException } from "@exceptions/conflict.exception";
import { UnauthorizedException } from "@exceptions/unauthorized.exception";
import { UnprocessableEntityException } from "@exceptions/unprocessable-entity.exception";
import { authRepository } from "@modules/auth/auth.repository";
import { AUTH_ERRORS } from "@modules/auth/auth.constants";
import type { JwtPayload, MasterKeyData } from "@modules/auth/auth.types";

export const authService = {
  register: async (
    name: string,
    email: string,
    password: string,
    masterKeyData: MasterKeyData,
  ) => {
    const existing = await authRepository.findByEmail(email);

    if (existing) throw new ConflictException(AUTH_ERRORS.EMAIL_ALREADY_IN_USE);

    const hashedPassword = await Bun.password.hash(password);

    return authRepository.create(name, email, hashedPassword, masterKeyData);
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
