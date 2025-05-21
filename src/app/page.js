"use client";

import { useState } from "react";
import PositionsTable from "./components/PositionsTable";
import WalletInput from "./components/WalletInput";
import { getPerpPositions } from "../lib/getPerpPositions";

export default function Home() {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleWalletsChange = async (wallets) => {
    setLoading(true);
    try {
      const fetchedPositions = await getPerpPositions(wallets);
      setPositions(fetchedPositions);
    } catch (err) {
      console.error("Error fetching positions:", err);
      setPositions([]); // Rensa om det går fel
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        <WalletInput onWalletsChange={handleWalletsChange} />
        {loading ? (
          <div className="text-center p-4">Loading positions...</div>
        ) : (
          <PositionsTable positions={positions} />
        )}
      </div>
    </div>
  );
}
