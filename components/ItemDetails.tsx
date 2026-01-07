"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { X } from "lucide-react"; 

type Item = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  used?: number;
  useful?: boolean;
  createdAt: any;
};

type ItemDetailsProps = {
  id: string;
  onClose: () => void;
};

export default function ItemDetails({ id, onClose }: ItemDetailsProps) {
  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      const docRef = doc(db, "items", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists())
        setItem({ id: docSnap.id, ...(docSnap.data() as Omit<Item, "id">) });
    };
    fetchItem();
  }, [id]);

  if (!item) return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40">
      <p className="text-white text-lg animate-pulse">Chargement...</p>
    </div>
  );

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200"
          title="Fermer"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        <h2 className="text-3xl font-bold mb-4 text-center">{item.name}</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-4 bg-gray-100 rounded-lg text-center">
            <p className="text-gray-500 text-sm">Quantité</p>
            <p className="font-semibold text-lg">{item.quantity}</p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg text-center">
            <p className="text-gray-500 text-sm">Utilisé</p>
            <p className="font-semibold text-lg">{item.used || 0}</p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg text-center">
            <p className="text-gray-500 text-sm">Prix unitaire</p>
            <p className="font-semibold text-lg">{item.unitPrice.toFixed(2)} Ariary</p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg text-center">
            <p className="text-gray-500 text-sm">Total</p>
            <p className="font-bold text-lg">{item.totalPrice.toFixed(2)} Ariary</p>
          </div>
        </div>

        {item.useful && (
          <div className="mb-4 text-center">
            <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Aliment utile
            </span>
          </div>
        )}

        <p className="text-gray-400 text-sm text-center">
          Ajouté le : {item.createdAt?.toDate().toLocaleString() || "N/A"}
        </p>
      </div>
    </div>
  );
}
