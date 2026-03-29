import { Elysia } from "elysia";
import { decrypt, encrypt } from "./server-crypto.helpers";

export const serverCryptoPlugin = new Elysia({
  name: "plugin:server-crypto",
}).decorate("serverCrypto", { encrypt, decrypt });
