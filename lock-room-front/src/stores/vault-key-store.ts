const KEY_STORAGE = 'lock-room:vault-key'
const isClient = typeof window !== 'undefined'

export const vaultKeyStore = {
  getKey: (): string | null => (isClient ? sessionStorage.getItem(KEY_STORAGE) : null),
  setKey: (key: string): void => {
    if (!isClient) return
    sessionStorage.setItem(KEY_STORAGE, key)
  },
  clearKey: (): void => {
    if (!isClient) return
    sessionStorage.removeItem(KEY_STORAGE)
  },
}
