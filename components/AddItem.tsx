"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AddItem() {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const totalPrice = quantity * unitPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || quantity <= 0 || unitPrice < 0) {
      alert("Veuillez remplir tous les champs correctement !");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "items"), {
        name,
        quantity,
        unitPrice,
        totalPrice,
        createdAt: new Date(),
      });
      setName("");
      setQuantity(1);
      setUnitPrice(0);
      alert("Item ajouté !");
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      alert("Erreur lors de l'ajout !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom de l'item"
        className="p-2 border rounded"
        required
      />
      <div className="flex gap-2">
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          placeholder="Quantité"
          min={1}
          className="p-2 border rounded flex-1"
          required
        />
        <input
          type="number"
          value={unitPrice}
          onChange={(e) => setUnitPrice(Number(e.target.value))}
          placeholder="Prix unitaire"
          min={0}
          step={0.01}
          className="p-2 border rounded flex-1"
          required
        />
      </div>
      <p className="text-gray-700 font-medium">
        Prix total : <span className="font-bold">{totalPrice.toFixed(2)} Ariary</span>
      </p>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {loading ? "Ajout..." : "Ajouter"}
      </button>
    </form>
  );
}
