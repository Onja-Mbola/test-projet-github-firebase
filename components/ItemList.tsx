"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore";

import AddItemFull from "./AddItemFull";
import UpdateItem from "./UpdateItem";
import ItemDetails from "./ItemDetails";

import { Trash, Edit, PlusCircle } from "lucide-react";

type Item = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  used?: number;
  useful?: boolean;
  createdAt?: any;
};

export default function ItemList() {
  const [items, setItems] = useState<Item[]>([]);
  const [addingNew, setAddingNew] = useState(false);
  const [updatingItem, setUpdatingItem] = useState<Item | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // 🔔 Récupération items et notifications
  useEffect(() => {
    const colRef = collection(db, "items");
    const q = query(colRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, snapshot => {
      const newItems = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Item, "id">) }));
      setItems(newItems);

      newItems.forEach(item => {
        if (item.useful && item.quantity <= 1) {
          sendNotification(item.name);
        }
      });
    });

    return () => unsubscribe();
  }, []);

  const sendNotification = async (name: string) => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted") {
      new Notification("A racheter !", { body: `${name} est presque épuisé !` });
    } else if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        new Notification("A racheter !", { body: `${name} est presque épuisé !` });
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet item ?")) return;
    await deleteDoc(doc(db, "items", id));
  };

  // Détermine couleur de la barre de progression
  const getProgressColor = (percentage: number) => {
    if (percentage > 70) return "bg-green-500";
    if (percentage > 30) return "bg-yellow-400";
    return "bg-red-500";
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Gestion de courses</h1>

      {/* Bouton Ajouter */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setAddingNew(true)}
          className="flex items-center gap-2 bg-green-500 text-white px-5 py-3 rounded-xl hover:bg-green-600 shadow-lg transition"
        >
          <PlusCircle className="w-5 h-5" />
          Ajouter un nouvel item
        </button>
      </div>

      {/* Modals */}
      {addingNew && <AddItemFull onClose={() => setAddingNew(false)} />}
      {updatingItem && <UpdateItem item={updatingItem} onClose={() => setUpdatingItem(null)} />}
      {selectedItemId && <ItemDetails id={selectedItemId} onClose={() => setSelectedItemId(null)} />}

      {/* Liste des items */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => {
          const remaining = item.quantity - (item.used || 0);
          const usedPercent = Math.min(((item.used || 0) / item.quantity) * 100, 100);
          const toBuy = item.quantity <= 1 ? 1 - item.quantity : 0;

          return (
            <li
              key={item.id}
              className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-2xl transition flex flex-col justify-between"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-2">
                <span
                  onClick={() => setSelectedItemId(item.id)}
                  className="font-semibold text-xl text-blue-600 hover:underline cursor-pointer"
                >
                  {item.name}
                </span>
                {item.useful && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Aliment utile
                  </span>
                )}
              </div>

              {/* Infos produit */}
              <div className="flex flex-col gap-1 mb-3 text-sm text-gray-700">
                <p>Quantité totale: <strong>{item.quantity}</strong></p>
                <p>Utilisé: <strong>{item.used || 0}</strong></p>
                <p>Prix unitaire: <strong>{item.unitPrice.toFixed(2)} Ariary</strong></p>
                <p className="font-bold">Total: {item.totalPrice.toFixed(2)} Ariary</p>
              </div>

              {/* Barre de progression */}
              <div className="mb-3">
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`${getProgressColor(usedPercent)} h-full rounded-full transition-all`}
                    style={{ width: `${usedPercent}%` }}
                  ></div>
                </div>
                <p className="text-right text-xs mt-1 text-gray-500">
                  {usedPercent.toFixed(0)}% utilisé
                </p>
              </div>

              {/* À acheter */}
              {toBuy > 0 && (
                <div className="mb-3">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    À acheter: {toBuy}
                  </span>
                </div>
              )}

              {/* Actions */}
                <div className="flex gap-1 mt-auto justify-end">
                <button
                    onClick={() => setUpdatingItem(item)}
                    className="flex items-center gap-1 bg-yellow-500 text-white px-2 py-1 rounded-lg hover:bg-yellow-600 transition text-xs"
                >
                    <Edit className="w-3 h-3" /> Update
                </button>
                <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition text-xs"
                >
                    <Trash className="w-3 h-3" /> Delete
                </button>
                </div>

            </li>
          );
        })}
      </ul>
    </div>
  );
}
