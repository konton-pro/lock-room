const KEY_STORAGE = 'lock-room:vault-key'

export const vaultKeyStore = {
  getKey: (): string | null => sessionStorage.getItem(KEY_STORAGE),
  setKey: (key: string): void => sessionStorage.setItem(KEY_STORAGE, key),
  clearKey: (): void => sessionStorage.removeItem(KEY_STORAGE),
}
