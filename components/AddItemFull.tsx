"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Check, X } from "lucide-react";

type Props = { onClose?: () => void };

export default function AddItemFull({ onClose }: Props) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const [useful, setUseful] = useState(false);
  const [loading, setLoading] = useState(false);

  const totalPrice = quantity * unitPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || quantity <= 0 || unitPrice < 0) return alert("Remplir tous les champs");

    setLoading(true);
    try {
      await addDoc(collection(db, "items"), {
        name,
        quantity,
        unitPrice,
        totalPrice,
        useful,
        used: 0,
        createdAt: new Date(),
      });
      setName("");
      setQuantity(1);
      setUnitPrice(0);
      setUseful(false);
      onClose?.();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'ajout !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded-lg shadow-md bg-white flex flex-col gap-3 w-full max-w-sm mx-auto"
    >
      <h3 className="text-lg font-semibold mb-2">Ajouter un nouvel item</h3>

      <input
        type="text"
        placeholder="Nom de l'item"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-2 border rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
        required
      />

      <div className="flex gap-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Quantité</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-20 p-2 border rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Prix unitaire</label>
          <input
            type="number"
            min={0}
            step={0.01}
            value={unitPrice}
            onChange={(e) => setUnitPrice(Number(e.target.value))}
            className="w-24 p-2 border rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={useful}
          onChange={(e) => setUseful(e.target.checked)}
          className="w-4 h-4"
        />
        Aliment utile
      </label>

      <p className="text-gray-700 font-medium">
        Total : <span className="font-bold">{totalPrice.toFixed(2)} Ariary</span>
      </p>

      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-1 bg-blue-500 text-white py-1.5 rounded-lg hover:bg-blue-600 text-sm transition"
        >
          <Check className="w-4 h-4" />
          {loading ? "..." : "Ajouter"}
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