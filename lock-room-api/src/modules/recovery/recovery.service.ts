import { BadRequestException } from "@exceptions/bad-request.exception";
import { NotFoundException } from "@exceptions/not-found.exception";
import { recoveryRepository } from "@modules/recovery/recovery.repository";
import { RECOVERY_ERRORS } from "@modules/recovery/recovery.constants";
import type {
  ServerCrypto,
  StoreRecoveryInput,
  ResetRecoveryInput,
} from "@modules/recovery/recovery.types";

export const recoveryService = {
  store: async (
    input: StoreRecoveryInput,
    userCuid: string,
    crypto: ServerCrypto,
  ) => {
    const userId =
      await recoveryRepository.findUserIdByCuid(userCuid);

    if (!userId)
      throw new NotFoundException(RECOVERY_ERRORS.USER_NOT_FOUND);

    const payloadBuffer = Buffer.from(input.encryptedPayload, "base64");
    const l2 = crypto.encrypt(payloadBuffer);

    return recoveryRepository.upsert({
      userId,
      encryptedPayload: l2.encrypted,
      clientIv: Buffer.from(input.iv, "base64"),
      clientTag: Buffer.from(input.tag, "base64"),
      serverIv: l2.iv,
      serverTag: l2.tag,
      recoveryKeyHash: input.recoveryKeyHash,
    });
  },

  status: async (userCuid: string) => {
    const recovery = await recoveryRepository.findByUserCuid(userCuid);

    return {
      hasRecoveryKey: !!recovery,
      createdAt: recovery?.createdAt ?? null,
    };
  },

  verify: async (
    email: string,
    recoveryKeyHash: string,
    crypto: ServerCrypto,
  ) => {
    const recovery = await recoveryRepository.findByEmailAndHash(
      email,
      recoveryKeyHash,
    );

    if (!recovery)
      throw new NotFoundException(RECOVERY_ERRORS.INVALID_RECOVERY_KEY);

    let decryptedPayload: Buffer;

    try {
      decryptedPayload = crypto.decrypt(
        recovery.encryptedPayload,
        recovery.serverIv,
        recovery.serverTag,
      );
    } catch {
      throw new BadRequestException(RECOVERY_ERRORS.INVALID_RECOVERY_KEY);
    }

    return {
      encryptedPayload: decryptedPayload.toString("base64"),
      iv: recovery.clientIv.toString("base64"),
      tag: recovery.clientTag.toString("base64"),
    };
  },

  reset: async (input: ResetRecoveryInput, crypto: ServerCrypto) => {
    const recovery = await recoveryRepository.findByEmailAndHash(
      input.email,
      input.recoveryKeyHash,
    );

    if (!recovery)
      throw new NotFoundException(RECOVERY_ERRORS.INVALID_RECOVERY_KEY);

    const hashedPassword = await Bun.password.hash(input.newPassword);

    const newPayloadBuffer = Buffer.from(input.newEncryptedPayload, "base64");
    const l2 = crypto.encrypt(newPayloadBuffer);

    await recoveryRepository.updateUserPassword(input.email, hashedPassword);

    await recoveryRepository.updatePayload(recovery.userId, {
      encryptedPayload: l2.encrypted,
      clientIv: Buffer.from(input.newIv, "base64"),
      clientTag: Buffer.from(input.newTag, "base64"),
      serverIv: l2.iv,
      serverTag: l2.tag,
    });
  },
};
