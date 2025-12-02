import { StoreGrid } from "@/app/(protected)/store/components/user/store-grid";
import { getOwnedItems, listStoreItems } from "@/utils/api/store";
import { getUserSession } from "@/utils/cookies";
import { Package, ShoppingCartIcon } from "lucide-react";
import { OwnedItems } from "./owned-items";

export default async function UserStore() {
  const sessionContext = await getUserSession();
  const ownedItems = await getOwnedItems();
  const storeItems = await listStoreItems();

  return (
    <>
      {/* Catálogo de Itens */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-6 flex gap-3 items-center">
          <ShoppingCartIcon /> Catálogo
        </h2>
        <StoreGrid items={storeItems.data} user={sessionContext.user} inventory={ownedItems.data} />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-6 flex gap-3 items-center">
          <Package /> Meus Itens
        </h2>
        <OwnedItems items={ownedItems.data} />
      </div>
    </>
  );
}
