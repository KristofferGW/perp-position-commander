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

getPerpPositions(["0xB9eABBb9475EA43f17C55F019B12073DAFe0A92A", "0x53babe76166eae33c861aeddf9ce89af20311cd0", "0x5078c2fbea2b2ad61bc840bc023e35fce56bedb6"]).then(console.log).catch(console.error);