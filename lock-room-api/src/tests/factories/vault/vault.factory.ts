import { faker } from "@faker-js/faker";
import { db } from "@database/index";
import { vault } from "@schema/vault.schema";
import { encrypt } from "@plugins/crypto/server-crypto/server-crypto.helpers";
import type { VaultOverrides, VaultFactoryResult } from "./vault-factory.types";

export class VaultFactory {
  protected count: number = 1;

  setCount(count: number) {
    this.count = count;
    return this;
  }

  async create(
    userCuid: string,
    overrides: VaultOverrides | VaultOverrides[] = {},
  ): Promise<VaultFactoryResult[]> {
    const user = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.cuid, userCuid),
      columns: { id: true },
    });

    if (!user) throw new Error(`User not found: ${userCuid}`);

    const rows = [];

    for (let i = 0; i < this.count; i++) {
      const row = {
        ...this.definition(),
        ...this.resolveOverrides(overrides, i),
      };

      const headerL2 = encrypt(row.encryptedHeader);
      const bodyL2 = encrypt(row.encryptedBody);

      rows.push({
        userId: user.id,
        encryptedHeader: headerL2.encrypted,
        encryptedBody: bodyL2.encrypted,
        clientIv: row.clientIv,
        serverHeaderIv: headerL2.iv,
        serverHeaderTag: headerL2.tag,
        serverBodyIv: bodyL2.iv,
        serverBodyTag: bodyL2.tag,
      });
    }

    return db.insert(vault).values(rows).returning({
      cuid: vault.cuid,
      createdAt: vault.createdAt,
      updatedAt: vault.updatedAt,
    });
  }

  protected definition(): Required<VaultOverrides> {
    return {
      encryptedHeader: Buffer.from(faker.string.alphanumeric(32)),
      encryptedBody: Buffer.from(faker.string.alphanumeric(64)),
      clientIv: Buffer.alloc(12),
    };
  }

  protected resolveOverrides(
    overrides: VaultOverrides | VaultOverrides[],
    index: number,
  ): VaultOverrides {
    return Array.isArray(overrides) ? (overrides[index] ?? {}) : overrides;
  }
}
