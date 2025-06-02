import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import WalletInput from '@/app/components/WalletInput'
import { mockWalletAddress, mockWalletAddress2 } from '../../utils/test-utils'

// Mock alert
global.alert = jest.fn()

describe('WalletInput', () => {
  const mockOnWalletsChange = jest.fn()

  beforeEach(() => {
    mockOnWalletsChange.mockClear()
    global.alert.mockClear()
    localStorage.clear()
  })

  it('renders wallet input form', () => {
    render(<WalletInput onWalletsChange={mockOnWalletsChange} />)
    
    expect(screen.getByText('Add EVM-addresses')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('0x...')).toBeInTheDocument()
    expect(screen.getByText('Add')).toBeInTheDocument()
  })

  it('adds valid wallet address', async () => {
    const user = userEvent.setup()
    render(<WalletInput onWalletsChange={mockOnWalletsChange} />)
    
    const input = screen.getByPlaceholderText('0x...')
    const addButton = screen.getByText('Add')
    
    await user.type(input, mockWalletAddress)
    await user.click(addButton)
    
    expect(screen.getByText(mockWalletAddress)).toBeInTheDocument()
    expect(screen.getByText('Remove')).toBeInTheDocument()
    expect(input.value).toBe('')
    expect(mockOnWalletsChange).toHaveBeenCalledWith([mockWalletAddress])
  })

  it('rejects invalid wallet address', async () => {
    const user = userEvent.setup()
    render(<WalletInput onWalletsChange={mockOnWalletsChange} />)
    
    const input = screen.getByPlaceholderText('0x...')
    const addButton = screen.getByText('Add')
    
    await user.type(input, 'invalid-address')
    await user.click(addButton)
    
    expect(global.alert).toHaveBeenCalledWith('Invalid Ethereum address')
    expect(screen.queryByText('invalid-address')).not.toBeInTheDocument()
    expect(mockOnWalletsChange).not.toHaveBeenCalled()
  })

  it('prevents duplicate addresses', async () => {
    const user = userEvent.setup()
    render(<WalletInput onWalletsChange={mockOnWalletsChange} />)
    
    const input = screen.getByPlaceholderText('0x...')
    const addButton = screen.getByText('Add')
    
    // Add first address
    await user.type(input, mockWalletAddress)
    await user.click(addButton)
    
    // Try to add same address again
    await user.type(input, mockWalletAddress)
    await user.click(addButton)
    
    expect(global.alert).toHaveBeenCalledWith('This address has already been added')
    expect(screen.getAllByText(mockWalletAddress)).toHaveLength(1)
  })

  it('removes wallet address', async () => {
    const user = userEvent.setup()
    render(<WalletInput onWalletsChange={mockOnWalletsChange} />)
    
    const input = screen.getByPlaceholderText('0x...')
    const addButton = screen.getByText('Add')
    
    // Add address
    await user.type(input, mockWalletAddress)
    await user.click(addButton)
    
    // Remove address
    const removeButton = screen.getByText('Remove')
    await user.click(removeButton)
    
    expect(screen.queryByText(mockWalletAddress)).not.toBeInTheDocument()
    expect(mockOnWalletsChange).toHaveBeenLastCalledWith([])
  })

  it('loads addresses from localStorage on mount', () => {
    localStorage.setItem('walletAddresses', JSON.stringify([mockWalletAddress, mockWalletAddress2]))
    
    render(<WalletInput onWalletsChange={mockOnWalletsChange} />)
    
    expect(screen.getByText(mockWalletAddress)).toBeInTheDocument()
    expect(screen.getByText(mockWalletAddress2)).toBeInTheDocument()
    expect(mockOnWalletsChange).toHaveBeenCalledWith([mockWalletAddress, mockWalletAddress2])
  })

  it('saves addresses to localStorage when updated', async () => {
    const user = userEvent.setup()
    render(<WalletInput onWalletsChange={mockOnWalletsChange} />)
    
    const input = screen.getByPlaceholderText('0x...')
    const addButton = screen.getByText('Add')
    
    await user.type(input, mockWalletAddress)
    await user.click(addButton)
    
    expect(localStorage.setItem).toHaveBeenCalledWith('walletAddresses', JSON.stringify([mockWalletAddress]))
  })

  it('switches between All and Single view modes', async () => {
    const user = userEvent.setup()
    render(<WalletInput onWalletsChange={mockOnWalletsChange} />)
    
    // Add two addresses
    const input = screen.getByPlaceholderText('0x...')
    const addButton = screen.getByText('Add')
    
    await user.type(input, mockWalletAddress)
    await user.click(addButton)
    await user.type(input, mockWalletAddress2)
    await user.click(addButton)
    
    // Switch to Single view
    const singleButton = screen.getByText('Single')
    await user.click(singleButton)
    
    expect(screen.getByText('-- Choose address --')).toBeInTheDocument()
    expect(mockOnWalletsChange).toHaveBeenLastCalledWith([])
    
    // Select an address
    const select = screen.getByRole('combobox')
    await user.selectOptions(select, mockWalletAddress)
    
    expect(mockOnWalletsChange).toHaveBeenLastCalledWith([mockWalletAddress])
    
    // Switch back to All view
    const allButton = screen.getByText('All')
    await user.click(allButton)
    
    expect(mockOnWalletsChange).toHaveBeenLastCalledWith([mockWalletAddress, mockWalletAddress2])
  })

  it('displays current view status', async () => {
    const user = userEvent.setup()
    render(<WalletInput onWalletsChange={mockOnWalletsChange} />)
    
    // Add address
    const input = screen.getByPlaceholderText('0x...')
    const addButton = screen.getByText('Add')
    
    await user.type(input, mockWalletAddress)
    await user.click(addButton)
    
    // Check All view status
    expect(screen.getByText('Vy: All')).toBeInTheDocument()
    
    // Switch to Single view
    const singleButton = screen.getByText('Single')
    await user.click(singleButton)
    
    // Select address
    const select = screen.getByRole('combobox')
    await user.selectOptions(select, mockWalletAddress)
    
    // Check Single view status with abbreviated address
    const shortAddress = `${mockWalletAddress.slice(0, 6)}...${mockWalletAddress.slice(-4)}`
    expect(screen.getByText(`Vy: Single (${shortAddress})`)).toBeInTheDocument()
  })

  it('handles Enter key to add address', async () => {
    const user = userEvent.setup()
    render(<WalletInput onWalletsChange={mockOnWalletsChange} />)
    
    const input = screen.getByPlaceholderText('0x...')
    
    await user.type(input, mockWalletAddress)
    await user.keyboard('{Enter}')
    
    expect(screen.getByText(mockWalletAddress)).toBeInTheDocument()
    expect(mockOnWalletsChange).toHaveBeenCalledWith([mockWalletAddress])
  })
})