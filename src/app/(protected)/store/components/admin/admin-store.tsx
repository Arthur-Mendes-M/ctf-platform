import { listStoreItems } from "@/utils/api/store";
import { Package } from "lucide-react";
import ItemsList from "./items-list";

export default async function AdminStore() {
  const storeItems = await listStoreItems();

  return (
    <>
      <div>
        <h2 className="text-xl font-semibold mb-6 flex gap-3 items-center">
          <Package /> Todos itens cridos
        </h2>
        <ItemsList itemsList={storeItems.data} />
      </div>
    </>
  );
}
