"use client"

import React from "react";

export default function PositionsTable({ positions }) {
    if (!positions || positions.length === 0) {
        return <div>No positions found.</div>;
    }

    const grouped = positions.reduce((acc, pos) => {
        acc[pos.wallet] = acc[pos.wallet] || [];
        acc[pos.wallet].push(pos);
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            {Object.entries(grouped).map(([wallet, walletPositions]) => (
                <div key={wallet} className="border p-4 rounded-xl shadow">
                    <h2 className="font-semibold text-lg mb-4 break-all text-blue-600">
                        Wallet: {wallet}
                    </h2>
                    <table className="w-full text-sm text-left border-collapse">
                        <thead>
                            <tr className="border-b">
                                <th className="py-1 px-2">Symbol</th>
                                <th className="py-1 px-2">Size</th>
                                <th className="py-1 px-2">Entry</th>
                                <th className="py-1 px-2">Leverage</th>
                                <th className="py-1 px-2">PnL</th>
                                <th className="py-1 px-2">Liq. Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {walletPositions.map((pos, i) => (
                                <tr key={i} className="border-t hover:bg-gray-50">
                                    <td className="py-1 px-2">{pos.symbol}</td>
                                    <td className="py-1 px-2">{pos.size}</td>
                                    <td className="py-1 px-2">${pos.entryPrice.toFixed(2)}</td>
                                    <td className="py-1 px-2">{pos.leverage}x</td>
                                    <td className={`py-1 px-2 ${pos.pnl >= 0 ? "text-green-600" : "text-red-500"}`}>
                                        {pos.pnl.toFixed(2)}
                                    </td>
                                    <td className="py-1 px-2">${pos.liquidationPrice?.toFixed(2) ?? "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
}