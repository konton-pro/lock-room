// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { VaultCard } from './vault-card'
import { useVaultCard } from '@/hooks/use-vault-card'
import type { VaultListItem } from '@/services/vault'

vi.mock('@/hooks/use-vault-card', () => ({
  useVaultCard: vi.fn(),
}))

vi.mock('./vault-detail-modal', () => ({
  VaultDetailModal: () => null,
}))

const useVaultCardMock = vi.mocked(useVaultCard)

const listItem: VaultListItem = {
  cuid: 'vault-entry-1234',
  encryptedHeader: 'encrypted-title',
  clientIv: 'client-iv',
  createdAt: '2026-04-05T00:00:00.000Z',
}

describe('VaultCard actions', () => {
  const copyMock = vi.fn()
  const toggleRevealMock = vi.fn()
  const onOpenDetailsMock = vi.fn()
  const onCloseDetailsMock = vi.fn()
  const onRequestDeleteMock = vi.fn()

  beforeEach(() => {
    copyMock.mockReset()
    toggleRevealMock.mockReset()
    onOpenDetailsMock.mockReset()
    onCloseDetailsMock.mockReset()
    onRequestDeleteMock.mockReset()

    useVaultCardMock.mockReturnValue({
      title: 'ACHE-JA-SUPERADMIN',
      body: 'body-secret',
      revealed: false,
      copying: false,
      copied: false,
      loadingBody: false,
      isTitleDecryptFailed: false,
      isBodyDecryptFailed: false,
      toggleReveal: toggleRevealMock,
      copy: copyMock,
    })
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('keeps copy available while the card stays hidden', () => {
    render(
      <VaultCard
        item={listItem}
        isSelected={false}
        onOpenDetails={onOpenDetailsMock}
        onCloseDetails={onCloseDetailsMock}
        onRequestDelete={onRequestDeleteMock}
        isDeleting={false}
      />,
    )

    expect(screen.getByRole('button', { name: 'Reveal content' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Copy content' })).toBeTruthy()
    expect(screen.queryByText('body-secret')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Copy content' }))

    expect(copyMock).toHaveBeenCalledTimes(1)
    expect(toggleRevealMock).not.toHaveBeenCalled()
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
      isTitleDecryptFailed: false,
      isBodyDecryptFailed: false,
      toggleReveal: toggleRevealMock,
      copy: copyMock,
    })

    render(
      <VaultCard
        item={listItem}
        isSelected={false}
        onOpenDetails={onOpenDetailsMock}
        onCloseDetails={onCloseDetailsMock}
        onRequestDelete={onRequestDeleteMock}
        isDeleting={false}
      />,
    )

    expect(screen.getByRole('button', { name: 'Copy content' }).hasAttribute('disabled')).toBe(true)
    expect(screen.getByText('COPYING')).toBeTruthy()
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
      isTitleDecryptFailed: false,
      isBodyDecryptFailed: false,
      toggleReveal: toggleRevealMock,
      copy: copyMock,
    })

    render(
      <VaultCard
        item={listItem}
        isSelected={false}
        onOpenDetails={onOpenDetailsMock}
        onCloseDetails={onCloseDetailsMock}
        onRequestDelete={onRequestDeleteMock}
        isDeleting={false}
      />,
    )

    expect(screen.getByText('COPIED')).toBeTruthy()
    expect(screen.queryByText('body-secret')).toBeNull()
  })

  it('requests deletion from the card without opening details', () => {
    render(
      <VaultCard
        item={listItem}
        isSelected={false}
        onOpenDetails={onOpenDetailsMock}
        onCloseDetails={onCloseDetailsMock}
        onRequestDelete={onRequestDeleteMock}
        isDeleting={false}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Delete entry' }))

    expect(onRequestDeleteMock).toHaveBeenCalledTimes(1)
    expect(onRequestDeleteMock).toHaveBeenCalledWith({
      id: 'vault-entry-1234',
      formattedId: 'VT-1234',
      title: 'ACHE-JA-SUPERADMIN',
    })
    expect(onOpenDetailsMock).not.toHaveBeenCalled()
  })

  it('disables the delete action while the entry is being deleted', () => {
    render(
      <VaultCard
        item={listItem}
        isSelected={false}
        onOpenDetails={onOpenDetailsMock}
        onCloseDetails={onCloseDetailsMock}
        onRequestDelete={onRequestDeleteMock}
        isDeleting
      />,
    )

    const button = screen.getByRole('button', { name: 'Delete entry' })

    expect(button.hasAttribute('disabled')).toBe(true)
    expect(screen.getByText('DELETING')).toBeTruthy()
  })
})
