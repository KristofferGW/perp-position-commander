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

  const walletPositions = useWalletStore((state) => state.walletPositions);
  const setWalletPositions = useWalletStore((state) => state.setWalletPositions);
  const getValidWalletPositions = useWalletStore((state) => state.getValidWalletPositions);

  const handleWalletsChange = async (walletList) => {
    setWallets(walletList);
    setError(null);
    setLoading(true);

    try {
      const allPositions = [];

      for (const wallet of walletList) {
        const cached = getValidWalletPositions(wallet);

        if (cached) {
          console.log(`✅ Cache HIT for`);
          allPositions.push(...cached);
        } else {
          console.log(`❌ Cache MISS for, fetching from API...`);
          const newPositions = await getValidWalletPositions([wallet]);
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
