import { BadRequestException } from "@exceptions/bad-request.exception";
import { ForbiddenException } from "@exceptions/forbidden.exception";
import { NotFoundException } from "@exceptions/not-found.exception";
import { vaultRepository } from "@modules/vault/vault.repository";
import { VAULT_ERRORS } from "@modules/vault/vault.constants";
import type { ServerCrypto, StoreVaultInput } from "@modules/vault/vault.types";

export const vaultService = {
  store: async (
    input: StoreVaultInput,
    userId: string,
    crypto: ServerCrypto,
  ) => {
    const headerL2 = crypto.encrypt(
      Buffer.from(input.encryptedHeader, "base64"),
    );
    const bodyL2 = crypto.encrypt(Buffer.from(input.encryptedBody, "base64"));

    const item = await vaultRepository.create({
      userCuid: userId,
      encryptedHeader: headerL2.encrypted,
      encryptedBody: bodyL2.encrypted,
      clientIv: Buffer.from(input.clientIv, "base64"),
      serverHeaderIv: headerL2.iv,
      serverHeaderTag: headerL2.tag,
      serverBodyIv: bodyL2.iv,
      serverBodyTag: bodyL2.tag,
    });

    return item;
  },

  retrieve: async (cuid: string, userId: string, crypto: ServerCrypto) => {
    const row = await vaultRepository.findByCuid(cuid);

    if (!row) throw new NotFoundException(VAULT_ERRORS.NOT_FOUND);

    if (row.user?.cuid !== userId)
      throw new ForbiddenException(VAULT_ERRORS.FORBIDDEN);

    let headerDecrypted: Buffer;
    let bodyDecrypted: Buffer;

    try {
      headerDecrypted = crypto.decrypt(
        row.encryptedHeader,
        row.serverHeaderIv,
        row.serverHeaderTag,
      );
      bodyDecrypted = crypto.decrypt(
        row.encryptedBody,
        row.serverBodyIv,
        row.serverBodyTag,
      );
    } catch {
      throw new BadRequestException(VAULT_ERRORS.DECRYPTION_FAILED);
    }

    return {
      cuid: row.cuid,
      encryptedHeader: headerDecrypted.toString("base64"),
      encryptedBody: bodyDecrypted.toString("base64"),
      clientIv: row.clientIv.toString("base64"),
      createdAt: row.createdAt,
    };
  },

  list: async (userId: string, crypto: ServerCrypto) => {
    const rows = await vaultRepository.findAllByUserCuid(userId);

    return rows.map((row) => {
      let headerDecrypted: Buffer;

      try {
        headerDecrypted = crypto.decrypt(
          row.encryptedHeader,
          row.serverHeaderIv,
          row.serverHeaderTag,
        );
      } catch {
        throw new BadRequestException(VAULT_ERRORS.DECRYPTION_FAILED);
      }

      return {
        cuid: row.cuid,
        encryptedHeader: headerDecrypted.toString("base64"),
        clientIv: row.clientIv.toString("base64"),
        createdAt: row.createdAt,
      };
    });
  },

  remove: async (cuid: string, userId: string) => {
    const row = await vaultRepository.findByCuid(cuid);
    if (!row) throw new NotFoundException(VAULT_ERRORS.NOT_FOUND);

    if (row.user?.cuid !== userId)
      throw new NotFoundException(VAULT_ERRORS.NOT_FOUND);

    await vaultRepository.removeByCuid(cuid, userId);
  },
};
