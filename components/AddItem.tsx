"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AddItem() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await addDoc(collection(db, "items"), { name });
    setName("");
    setLoading(false);
    alert("Item ajouté !");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom de l'item"
        className="flex-1 p-2 border rounded"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
      >
        {loading ? "Ajout..." : "Ajouter"}
      </button>
    </form>
  );
}
