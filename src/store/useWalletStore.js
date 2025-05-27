import { create } from 'zustand'

const TTL = 60 * 1000; // 1 minute

const useWalletStore = create((set) => ({
  walletPositions: {}, // { [wallet]: { data: [...], timestamp: 1234567890 } }

  setWalletPositions: (wallet, positions) =>
    set((state) => ({
      walletPositions: {
        ...state.walletPositions,
        [wallet]: {
          data: positions,
          timestamp: Date.now(),
        },
      },
    })),

  getValidWalletPositions: (wallet) => {
    const entry = useWalletStore.getState().walletPositions[wallet];
    if (!entry) return null;

    const isFresh = Date.now() - entry.timestamp < TTL;
    return isFresh ? entry.data : null;
  },

}));

export default useWalletStore
