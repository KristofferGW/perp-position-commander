"use client";

import React from "react";

export default function PositionsTable({ positions, allWallets }) {
    const grouped = positions.reduce((acc, pos) => {
        acc[pos.wallet] = acc[pos.wallet] || [];
        acc[pos.wallet].push(pos);
        return acc;
    }, {});

    if (!allWallets || allWallets.length === 0) {
        return <div className="w-64 mx-auto text-center">No wallets selected.</div>;
    }

    return (
        <div className="space-y-6">
            {allWallets.map((wallet) => {
                const walletPositions = grouped[wallet] || [];

                return (
                    <div key={wallet} className="border p-4 rounded-xl shadow">
                        <h2 className="font-semibold text-lg mb-4 break-all text-blue-600">
                            Wallet: {wallet}
                        </h2>

                        {walletPositions.length === 0 ? (
                            <div className="text-gray-500 text-sm">No positions for wallet</div>
                        ) : (
                            <table className="w-full text-sm text-left border-collapse">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-1 px-2">Symbol</th>
                                        <th className="py-1 px-2">Side</th>
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
                                            <td className="py-1 px-2">{pos.size >= 0 ? "Long" : "Short"}</td>
                                            <td className="py-1 px-2">{Math.abs(pos.size)}</td>
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
                        )}
                    </div>
                );
            })}
        </div>
    );
}
