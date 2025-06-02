import { render, screen } from '@testing-library/react'
import PositionsTable from '@/app/components/PositionsTable'
import { mockPositions, mockWalletAddress, mockWalletAddress2 } from '../../utils/test-utils'

describe('PositionsTable', () => {
  it('renders no wallets message when allWallets is empty', () => {
    render(<PositionsTable positions={[]} allWallets={[]} />)
    expect(screen.getByText('No wallets selected.')).toBeInTheDocument()
  })

  it('renders wallet with no positions', () => {
    render(<PositionsTable positions={[]} allWallets={[mockWalletAddress]} />)
    
    expect(screen.getByText(`Wallet: ${mockWalletAddress}`)).toBeInTheDocument()
    expect(screen.getByText('No positions for wallet')).toBeInTheDocument()
  })

  it('renders positions table with correct data', () => {
    render(<PositionsTable positions={mockPositions} allWallets={[mockWalletAddress, mockWalletAddress2]} />)
    
    // Check wallet headers
    expect(screen.getByText(`Wallet: ${mockWalletAddress}`)).toBeInTheDocument()
    expect(screen.getByText(`Wallet: ${mockWalletAddress2}`)).toBeInTheDocument()
    
    // Check table headers
    expect(screen.getAllByText('Symbol')).toHaveLength(2)
    expect(screen.getAllByText('Side')).toHaveLength(2)
    expect(screen.getAllByText('Size')).toHaveLength(2)
    expect(screen.getAllByText('Entry')).toHaveLength(2)
    expect(screen.getAllByText('Leverage')).toHaveLength(2)
    expect(screen.getAllByText('PnL')).toHaveLength(2)
    expect(screen.getAllByText('Liq. Price')).toHaveLength(2)
    
    // Check position data
    expect(screen.getByText('BTC')).toBeInTheDocument()
    expect(screen.getByText('ETH')).toBeInTheDocument()
    expect(screen.getByText('SOL')).toBeInTheDocument()
    
    // Check long/short sides
    expect(screen.getAllByText('Long')).toHaveLength(2) // BTC and SOL
    expect(screen.getByText('Short')).toBeInTheDocument() // ETH
    
    // Check sizes (absolute values)
    expect(screen.getByText('0.1')).toBeInTheDocument()
    expect(screen.getByText('1.5')).toBeInTheDocument() // ETH size is -1.5, should show 1.5
    expect(screen.getByText('10')).toBeInTheDocument()
    
    // Check PnL colors
    const profitPnl = screen.getByText('500.25')
    const lossPnl = screen.getByText('-150.75')
    expect(profitPnl).toHaveClass('text-green-600')
    expect(lossPnl).toHaveClass('text-red-500')
  })

  it('formats prices correctly', () => {
    render(<PositionsTable positions={mockPositions} allWallets={[mockWalletAddress]} />)
    
    expect(screen.getByText('$45000.00')).toBeInTheDocument()
    expect(screen.getByText('$3000.00')).toBeInTheDocument()
    expect(screen.getByText('$40500.00')).toBeInTheDocument()
    expect(screen.getByText('$3300.00')).toBeInTheDocument()
  })

  it('handles missing liquidation price', () => {
    const positionsWithoutLiqPrice = [{
      ...mockPositions[0],
      liquidationPrice: null
    }]

    console.log('Rendering positions without liquidation price:', positionsWithoutLiqPrice)
    
    render(<PositionsTable positions={positionsWithoutLiqPrice} allWallets={[mockWalletAddress]} />)

    screen.debug();

    expect(screen.getByText(/—/)).toBeInTheDocument()
  })

  it('groups positions by wallet correctly', () => {
    const mixedPositions = [
      { ...mockPositions[0], wallet: mockWalletAddress },
      { ...mockPositions[2], wallet: mockWalletAddress2 },
      { ...mockPositions[1], wallet: mockWalletAddress },
    ]
    
    render(<PositionsTable positions={mixedPositions} allWallets={[mockWalletAddress, mockWalletAddress2]} />)
    
    const walletSections = screen.getAllByText(/^Wallet:/)
    expect(walletSections).toHaveLength(2)
    
    // First wallet should have BTC and ETH positions
    const firstWalletSection = walletSections[0].closest('div')
    expect(firstWalletSection).toHaveTextContent('BTC')
    expect(firstWalletSection).toHaveTextContent('ETH')
    
    // Second wallet should have SOL position
    const secondWalletSection = walletSections[1].closest('div')
    expect(secondWalletSection).toHaveTextContent('SOL')
  })
})