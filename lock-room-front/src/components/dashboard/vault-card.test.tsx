// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { VaultCard } from './vault-card'
import { useVaultCard } from '@/hooks/use-vault-card'
import type { VaultListItem } from '@/services/vault'

vi.mock('@/hooks/use-vault-card', () => ({
  useVaultCard: vi.fn(),
}))

const useVaultCardMock = vi.mocked(useVaultCard)

const listItem: VaultListItem = {
  cuid: 'vault-entry-1234',
  encryptedHeader: 'encrypted-title',
  clientIv: 'client-iv',
  createdAt: '2026-04-05T00:00:00.000Z',
}

describe('VaultCard hidden copy UI', () => {
  const copyMock = vi.fn()
  const revealMock = vi.fn()

  beforeEach(() => {
    copyMock.mockReset()
    revealMock.mockReset()

    useVaultCardMock.mockReturnValue({
      title: 'ACHE-JA-SUPERADMIN',
      body: 'body-secret',
      revealed: false,
      copying: false,
      copied: false,
      loadingBody: false,
      reveal: revealMock,
      copy: copyMock,
    })
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('keeps copy available while the card stays hidden', () => {
    render(<VaultCard item={listItem} />)

    expect(screen.getByText('[ LOCKED ]')).toBeTruthy()
    expect(screen.getByRole('button', { name: '[VIEW]' })).toBeTruthy()
    expect(screen.getByRole('button', { name: '[CPY]' })).toBeTruthy()
    expect(screen.queryByText('body-secret')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: '[CPY]' }))

    expect(copyMock).toHaveBeenCalledTimes(1)
    expect(revealMock).not.toHaveBeenCalled()
    expect(screen.queryByText('body-secret')).toBeNull()
  })

  it('shows a busy state on the copy button without revealing the content', () => {
    useVaultCardMock.mockReturnValue({
      title: 'ACHE-JA-SUPERADMIN',
      body: 'body-secret',
      revealed: false,
      copying: true,
      copied: false,
      loadingBody: false,
      reveal: revealMock,
      copy: copyMock,
    })

    render(<VaultCard item={listItem} />)

    expect(screen.getByRole('button', { name: '[...]' }).hasAttribute('disabled')).toBe(true)
    expect(screen.queryByText('body-secret')).toBeNull()
  })

  it('shows copy success feedback while keeping the card visually locked', () => {
    useVaultCardMock.mockReturnValue({
      title: 'ACHE-JA-SUPERADMIN',
      body: 'body-secret',
      revealed: false,
      copying: false,
      copied: true,
      loadingBody: false,
      reveal: revealMock,
      copy: copyMock,
    })

    render(<VaultCard item={listItem} />)

    expect(screen.getByText('[ LOCKED ]')).toBeTruthy()
    expect(screen.getByRole('button', { name: '[OK]' })).toBeTruthy()
    expect(screen.queryByText('body-secret')).toBeNull()
  })
})
