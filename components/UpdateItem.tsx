"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { X, Check } from "lucide-react";

type Props = {
  item: {
    id: string;
    name: string;
    quantity: number;
    used?: number;
  };
  onClose: () => void;
};

export default function UpdateItem({ item, onClose }: Props) {
  const [used, setUsed] = useState(item.used || 0);
  const [quantity, setQuantity] = useState(item.quantity);
  const [purchased, setPurchased] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (used < 0 || used > quantity) {
      return alert("Quantité utilisée invalide");
    }
    if (purchased < 0) {
      return alert("Quantité achetée invalide");
    }

    setLoading(true);
    try {
      const newQuantity = quantity + purchased;
      await updateDoc(doc(db, "items", item.id), { used, quantity: newQuantity });
      onClose();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded-lg shadow-md bg-white flex flex-col gap-3 w-full max-w-sm mx-auto"
    >
      <h3 className="text-lg font-semibold mb-2">Mettre à jour {item.name}</h3>

      <div className="flex gap-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Quantité utilisée</label>
          <input
            type="number"
            min={0}
            max={quantity}
            value={used}
            onChange={(e) => setUsed(Number(e.target.value))}
            className="w-20 p-2 border rounded focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-600 mb-1">Quantité achetée</label>
          <input
            type="number"
            min={0}
            value={purchased}
            onChange={(e) => setPurchased(Number(e.target.value))}
            className="w-20 p-2 border rounded focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-600 mb-1">Quantité actuelle</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-20 p-2 border rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {purchased > 0 && (
        <p className="text-sm text-green-600">
          Nouvelle quantité totale : <span className="font-bold">{quantity + purchased}</span>
        </p>
      )}

      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-1 bg-yellow-500 text-white py-1.5 rounded-lg hover:bg-yellow-600 text-sm transition"
        >
          <Check className="w-4 h-4" />
          {loading ? "..." : "Mettre à jour"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 flex items-center justify-center gap-1 bg-gray-300 text-black py-1.5 rounded-lg hover:bg-gray-400 text-sm transition"
        >
          <X className="w-4 h-4" /> Annuler
        </button>
      </div>
    </form>
  );
}