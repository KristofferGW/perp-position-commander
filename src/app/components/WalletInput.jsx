import { useEffect, useState } from "react";

const LOCAL_STORAGE_KEY = "walletAddresses";

export default function WalletInput() {
  const [input, setInput] = useState("");
  const [addresses, setAddresses] = useState([]);

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
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-2xl shadow bg-white">
      <h2 className="text-xl font-semibold mb-3">Add EVM-addresses</h2>
      <div className="flex gap-2 mb-4">
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
    </div>
  );
}
