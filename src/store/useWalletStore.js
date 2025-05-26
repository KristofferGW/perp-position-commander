import { create } from 'zustand'

const useWalletStore = create((set) => ({
  walletPositions: {}, // cache: { [walletAddress]: [positions] }
  setWalletPositions: (wallet, positions) =>
    set((state) => ({
      walletPositions: {
        ...state.walletPositions,
        [wallet]: positions,
      },
    })),
}))

export default useWalletStore
