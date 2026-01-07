"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { X } from "lucide-react"; 

type AddItemProps = {
  itemToEdit?: {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
  };
  onClose?: () => void;
};

export default function AddItem({ itemToEdit, onClose }: AddItemProps) {
  const [name, setName] = useState(itemToEdit?.name || "");
  const [quantity, setQuantity] = useState<number>(itemToEdit?.quantity || 1);
  const [unitPrice, setUnitPrice] = useState<number>(itemToEdit?.unitPrice || 0);
  const [loading, setLoading] = useState(false);

  const totalPrice = quantity * unitPrice;

  useEffect(() => {
    setName(itemToEdit?.name || "");
    setQuantity(itemToEdit?.quantity || 1);
    setUnitPrice(itemToEdit?.unitPrice || 0);
  }, [itemToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || quantity <= 0 || unitPrice < 0) {
      alert("Veuillez remplir tous les champs correctement !");
      return;
    }

    setLoading(true);
    try {
      if (itemToEdit) {
        const docRef = doc(db, "items", itemToEdit.id);
        await updateDoc(docRef, { name, quantity, unitPrice, totalPrice });
        alert("Item mis à jour !");
      } else {
        await addDoc(collection(db, "items"), {
          name,
          quantity,
          unitPrice,
          totalPrice,
          createdAt: new Date(),
        });
        alert("Item ajouté !");
      }
      onClose && onClose();
      setName("");
      setQuantity(1);
      setUnitPrice(0);
    } catch (error) {
      console.error("Erreur :", error);
      alert("Erreur lors de l'opération !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4 z-50">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col gap-4 relative"
      >
        {/* Bouton fermer */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-2">
          {itemToEdit ? "Mettre à jour l'item" : "Ajouter un nouvel item"}
        </h2>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom de l'item"
          className="p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <div className="flex gap-3">
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            placeholder="Quantité"
            min={1}
            className="p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 flex-1"
            required
          />
          <input
            type="number"
            value={unitPrice}
            onChange={(e) => setUnitPrice(Number(e.target.value))}
            placeholder="Prix unitaire"
            min={0}
            step={0.01}
            className="p-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 flex-1"
            required
          />
        </div>

        <p className="text-gray-700 font-medium">
          Prix total : <span className="font-bold">{totalPrice.toFixed(2)} Ariary</span>
        </p>

        <div className="flex gap-3 mt-2 justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition flex items-center gap-2"
          >
            {loading ? "En cours..." : itemToEdit ? "Mettre à jour" : "Ajouter"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-300 transition"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
