import { faker } from "@faker-js/faker";
import { db } from "@database/index";
import { users } from "@schema/users.schema";
import type { UserOverrides, UserFactoryResult } from "./user-factory.types";

export class UserFactory {
  protected count: number = 1;

  setCount(count: number) {
    this.count = count;
    return this;
  }

  async create(
    overrides: UserOverrides | UserOverrides[] = {},
  ): Promise<UserFactoryResult[]> {
    const rows = [];
    const plaintextPasswords: string[] = [];

    for (let i = 0; i < this.count; i++) {
      const row = {
        ...this.definition(),
        ...this.resolveOverrides(overrides, i),
      };

      plaintextPasswords.push(row.password);
      rows.push({ ...row, password: await Bun.password.hash(row.password) });
    }

    const inserted = await db.insert(users).values(rows).returning({
      cuid: users.cuid,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    });

    return inserted.map((user, i) => ({
      ...user,
      password: plaintextPasswords[i]!,
    }));
  }

  protected definition(): Required<UserOverrides> {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12 }),
    };
  }

  protected resolveOverrides(
    overrides: UserOverrides | UserOverrides[],
    index: number,
  ): UserOverrides {
    return Array.isArray(overrides) ? (overrides[index] ?? {}) : overrides;
  }
}
