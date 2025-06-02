import { render } from '@testing-library/react'

export const mockWalletAddress = '0x1234567890123456789012345678901234567890'
export const mockWalletAddress2 = '0x0987654321098765432109876543210987654321'

export const mockPositions = [
  {
    wallet: mockWalletAddress,
    symbol: 'BTC',
    entryPrice: 45000,
    size: 0.1,
    leverage: 10,
    pnl: 500.25,
    liquidationPrice: 40500,
  },
  {
    wallet: mockWalletAddress,
    symbol: 'ETH',
    entryPrice: 3000,
    size: -1.5,
    leverage: 5,
    pnl: -150.75,
    liquidationPrice: 3300,
  },
  {
    wallet: mockWalletAddress2,
    symbol: 'SOL',
    entryPrice: 100,
    size: 10,
    leverage: 3,
    pnl: 250.50,
    liquidationPrice: 85,
  },
]

export const mockHyperliquidResponse = {
  assetPositions: [
    {
      position: {
        coin: 'BTC',
        entryPx: '45000.0',
        szi: '0.1',
        leverage: { value: 10 },
        unrealizedPnl: '500.25',
        liquidationPx: '40500.0',
      }
    },
    {
      position: {
        coin: 'ETH',
        entryPx: '3000.0',
        szi: '-1.5',
        leverage: { value: 5 },
        unrealizedPnl: '-150.75',
        liquidationPx: '3300.0',
      }
    }
  ]
}

export function renderWithProviders(ui, options = {}) {
  return render(ui, {
    // Add providers here if needed (e.g., theme, router, etc.)
    ...options,
  })
}

export function mockFetchSuccess(data) {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => data,
  })
}

export function mockFetchError(status = 500, message = 'Server Error') {
  global.fetch.mockResolvedValueOnce({
    ok: false,
    status,
    text: async () => message,
  })
}