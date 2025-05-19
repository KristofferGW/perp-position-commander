export async function getPerpPositions(address) {
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
    symbol: position.coin,
    entryPrice: parseFloat(position.entryPx),
    size: parseFloat(position.szi),
    leverage: position.leverage.value,
    pnl: parseFloat(position.unrealizedPnl),
    liquidationPrice: parseFloat(position.liquidationPx || position.liquidationPx),
  }));
}

const perpPositionsTest = getPerpPositions("0xB9eABBb9475EA43f17C55F019B12073DAFe0A92A")
  .then(console.log)
  .catch(console.error);

console.log(perpPositionsTest);