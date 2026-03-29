export const cryptoConfig = {
  masterKey: Buffer.from(process.env.SERVER_MASTER_KEY ?? "", "hex"),
};
