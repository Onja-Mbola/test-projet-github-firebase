import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import AddItem from "@/components/AddItem";

type Item = {
  id: string;
  name: string;
};

async function getItems(): Promise<Item[]> {
  const querySnapshot = await getDocs(collection(db, "items"));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Item, "id">),
  }));
}

export default async function ItemsPage() {
  const items = await getItems();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Ma jolie liste</h1>
      <AddItem />
      <ul className="space-y-4">
        {items.map(item => (
          <li
            key={item.id}
            className="p-4 border rounded-lg shadow hover:shadow-lg transition"
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
