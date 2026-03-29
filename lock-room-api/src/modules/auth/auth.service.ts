import { ConflictException } from "@exceptions/conflict.exception";
import { UnauthorizedException } from "@exceptions/unauthorized.exception";
import { authRepository } from "./auth.repository";
import { AUTH_ERRORS } from "./auth.constants";
import type { JwtPayload } from "./auth.types";

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

    return { sub: user.id, email: user.email };
  },
};
