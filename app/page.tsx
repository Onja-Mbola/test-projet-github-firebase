import Image from "next/image";
import AddItem from "@/components/AddItem";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

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


export default async function Home() {
  const items = await getItems();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">

        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Ma jolie liste sur la page d'accueil
          </h1>
        </div>

        <AddItem />

        <ul className="space-y-4 w-full">
          {items.map(item => (
            <li
              key={item.id}
              className="p-4 border rounded-lg shadow hover:shadow-lg transition"
            >
              {item.name}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

