"use client";

import { useState } from "react";
import PositionsTable from "./components/PositionsTable";
import WalletInput from "./components/WalletInput";
import { getPerpPositions } from "../lib/getPerpPositions";
import useWalletStore from "@/store/useWalletStore";

export default function Home() {
  const [wallets, setWallets] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const setWalletPositions = useWalletStore((state) => state.setWalletPositions);
  const getValidWalletPositions = useWalletStore((state) => state.getValidWalletPositions);

  const handleWalletsChange = async (walletList, forceRefresh = false) => {
    setWallets(walletList);
    setError(null);
    setLoading(true);

    try {
      const allPositions = [];

      for (const wallet of walletList) {
        const cached = forceRefresh ? null : getValidWalletPositions(wallet);

        if (cached) {
          allPositions.push(...cached);
        } else {
          const newPositions = await getPerpPositions(wallet);
          setWalletPositions(wallet, newPositions);
          allPositions.push(...newPositions);
        }
      }

      setPositions(allPositions);
    } catch (error) {
      setPositions([]);
      setError("Failed to fetch positions. Please try again.");
      console.error("Error fetching positions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        <WalletInput onWalletsChange={handleWalletsChange} />

        <div className="flex justify-center mb-4">
          <button
            onClick={() => handleWalletsChange(wallets, true)}
            disabled={loading}
            className={`mb-4 px-4 py-2 rounded transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
          >
            {loading ? "Refreshing..." : "Refresh positions"}
          </button>
        </div>

        {error && (
          <div className="text-center text-red-600 bg-red-100 border border-red-300 p-3 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center p-4">Loading positions...</div>
        ) : (
          <PositionsTable positions={positions} allWallets={wallets} />
        )}
      </div>
    </div>
  );
}
