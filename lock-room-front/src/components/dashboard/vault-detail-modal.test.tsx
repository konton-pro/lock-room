// @vitest-environment jsdom

import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { VaultDetailModal } from './vault-detail-modal'

describe('VaultDetailModal delete action', () => {
  it('calls the delete handler from the detail footer', () => {
    const onRequestDelete = vi.fn()

    render(
      <VaultDetailModal
        isOpen
        onClose={vi.fn()}
        title="SECRET_ENTRY"
        body="body-secret"
        createdAt="2026-04-05T00:00:00.000Z"
        formattedId="VT-1234"
        revealed
        onToggleReveal={vi.fn()}
        isLoading={false}
        isDecryptFailed={false}
        copied={false}
        onCopy={vi.fn(async () => undefined)}
        onRequestDelete={onRequestDelete}
        isDeleting={false}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: '[ DELETE_ENTRY ]' }))

    expect(onRequestDelete).toHaveBeenCalledTimes(1)
  })

  it('blocks a second delete click while the request is pending', () => {
    const onRequestDelete = vi.fn()

    render(
      <VaultDetailModal
        isOpen
        onClose={vi.fn()}
        title="SECRET_ENTRY"
        body="body-secret"
        createdAt="2026-04-05T00:00:00.000Z"
        formattedId="VT-1234"
        revealed
        onToggleReveal={vi.fn()}
        isLoading={false}
        isDecryptFailed={false}
        copied={false}
        onCopy={vi.fn(async () => undefined)}
        onRequestDelete={onRequestDelete}
        isDeleting
      />,
    )

    const button = screen.getByRole('button', { name: '[ DELETING ]' })
    fireEvent.click(button)

    expect(button.hasAttribute('disabled')).toBe(true)
    expect(onRequestDelete).not.toHaveBeenCalled()
  })
})
