"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import AddItem from "@/components/AddItem";

type Item = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const colRef = collection(db, "items");
    const q = query(colRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, snapshot => {
      const newItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Item, "id">),
      }));
      setItems(newItems);
    });

    return () => unsubscribe(); 
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Liste des courses</h1>
      <AddItem />
      <ul className="space-y-4">
        {items.map(item => (
          <li
            key={item.id}
            className="p-4 border rounded-lg shadow hover:shadow-lg transition flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
          >
            <span className="font-semibold">{item.name}</span>
            <span>Quantité : {item.quantity}</span>
            <span>Prix unitaire : {item.unitPrice.toFixed(2)} Ariary</span>
            <span className="font-bold">Total : {item.totalPrice.toFixed(2)} Ariary</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
