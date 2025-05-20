async function fetchPerpPositionsForAddress(address) {
  const payload = {
    type: "clearinghouseState",
    user: address.trim(),
    dex: ""
  };

  const response = await fetch("https://api.hyperliquid.xyz/info", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error ${response.status}: ${errorText}`);
  }

  const data = await response.json();

  return (data.assetPositions || []).map(({ position }) => ({
    wallet: address,
    symbol: position.coin,
    entryPrice: parseFloat(position.entryPx),
    size: parseFloat(position.szi),
    leverage: position.leverage.value,
    pnl: parseFloat(position.unrealizedPnl),
    liquidationPrice: parseFloat(position.liquidationPx || position.liquidationPx),
  }));
}

export async function getPerpPositions(addressOrArray) {
  const addresses = Array.isArray(addressOrArray) ? addressOrArray : [addressOrArray];

  const results = await Promise.all(
    addresses.map(addr => fetchPerpPositionsForAddress(addr))
  );

  return results.flat();
}