import { useEffect, useState } from "react";

const LOCAL_STORAGE_KEY = "walletAddresses";

export default function WalletInput() {
  const [input, setInput] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [selectedView, setSelectedView] = useState("all");
  const [selectedAddress, setSelectedAddress] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) setAddresses(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(addresses));
  }, [addresses]);

  const isValidAddress = (addr) => /^0x[a-fA-F0-9]{40}$/.test(addr.trim());

  const addAddress = () => {
    const trimmed = input.trim();

    if (!isValidAddress(trimmed)) {
      alert("Ogiltig Ethereum-adress");
      return;
    }
    if (addresses.includes(trimmed)) {
      alert("Den här adressen är redan tillagd");
      return;
    }

    setAddresses([...addresses, trimmed]);
    setInput("");
  };

  const removeAddress = (addr) => {
    setAddresses(addresses.filter((a) => a !== addr));
    if (selectedAddress === addr) {
      setSelectedAddress("");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-2xl shadow bg-white space-y-4">
      <h2 className="text-xl font-semibold">Add EVM-addresses</h2>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow border rounded px-3 py-2 text-sm"
          placeholder="0x..."
        />
        <button
          onClick={addAddress}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {addresses.map((addr, i) => (
          <li
            key={i}
            className="flex justify-between items-center bg-gray-100 rounded px-3 py-2 text-sm"
          >
            <span className="break-all">{addr}</span>
            <button
              onClick={() => removeAddress(addr)}
              className="text-red-500 hover:underline"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      {addresses.length > 0 && (
        <div className="space-y-2">
          <div className="flex gap-4">
            <label className="font-medium">Show:</label>
            <button
              className={`px-3 py-1 rounded ${
                selectedView === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setSelectedView("all")}
            >
              All
            </button>
            <button
              className={`px-3 py-1 rounded ${
                selectedView === "single" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setSelectedView("single")}
            >
              Single
            </button>
          </div>

          {selectedView === "single" && (
            <select
              className="w-full border rounded px-3 py-2"
              value={selectedAddress}
              onChange={(e) => setSelectedAddress(e.target.value)}
            >
              <option value="">-- Choose address --</option>
              {addresses.map((addr) => (
                <option key={addr} value={addr}>
                  {addr}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      <div className="mt-4">
        <p className="text-sm text-gray-600">
          Vy: <strong>{selectedView}</strong>{" "}
          {selectedView === "single" && selectedAddress && (
            <>({selectedAddress.slice(0, 6)}...{selectedAddress.slice(-4)})</>
          )}
        </p>
      </div>
    </div>
  );
}
