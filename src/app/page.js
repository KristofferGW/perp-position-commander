"use client";

import PositionsTable from "./components/PositionsTable";
import WalletInput from "./components/WalletInput";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        <WalletInput onWalletsChange={handleWalletsChange}/>
        <PositionsTable />
      </div>
    </div>
  );
}
