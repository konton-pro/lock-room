import { ConflictException } from "@exceptions/conflict.exception";
import { UnauthorizedException } from "@exceptions/unauthorized.exception";
import { authRepository } from "@modules/auth/auth.repository";
import { AUTH_ERRORS } from "@modules/auth/auth.constants";
import type { JwtPayload } from "@modules/auth/auth.types";

export const authService = {
  register: async (email: string, password: string) => {
    const existing = await authRepository.findByEmail(email);

    if (existing) throw new ConflictException(AUTH_ERRORS.EMAIL_ALREADY_IN_USE);

    const hashedPassword = await Bun.password.hash(password);

    return authRepository.create(email, hashedPassword);
  },

  login: async (email: string, password: string): Promise<JwtPayload> => {
    const user = await authRepository.findByEmail(email);
    
    if (!user) throw new UnauthorizedException(AUTH_ERRORS.INVALID_CREDENTIALS);

    const valid = await Bun.password.verify(password, user.password);

    if (!valid)
      throw new UnauthorizedException(AUTH_ERRORS.INVALID_CREDENTIALS);

    return { sub: user.cuid, email: user.email };
  },
};
