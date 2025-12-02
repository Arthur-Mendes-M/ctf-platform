import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/components/submit-button";
import { Gem, ShoppingCart } from "lucide-react";
import {
  InventoryList,
  ProductActions,
  ProductActionsStyles,
  ProductType,
} from "@/utils/types/store";
import { Badge } from "@/components/ui/badge";
import { UserType } from "@/utils/types/user";
import { purchaseItem } from "@/utils/api/store";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserSession } from "@/utils/cookies";

export default function StoreItemView({
  open,
  onOpenChange,
  selectedItem,
  user,
  inventory,
}: {
  open: boolean;
  onOpenChange: (open?: boolean) => void;
  selectedItem: ProductType | null;
  user: Pick<UserType, "ruby">;
  inventory: InventoryList;
}) {
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);

  const mutation = useMutation({
    mutationKey: ["products"],
    mutationFn: async () => await purchaseItem(selectedItem!.id, quantity),
    onSuccess: async (data) => {
      if (data.success) {
        queryClient.setQueryData(["products"], data.data.user.inventory);
        await updateUserSession({
          user: {
            xp: data.data.user.xp,
            ruby: data.data.user.ruby,
          },
        });

        toast.success(data.message);
        onOpenChange();
      } else {
        toast.error("Não foi possível finalizar a compra", {
          description: data.message,
        });
      }
    },
  });

  const handlePurchase = async () => {
    if (!selectedItem || getMaxPurchaseForCurrentProduct() <= 0) return;

    mutation.mutate();
  };

  // const Icon = selectedItem
  //   ? ProductCategoriesStyles[selectedItem.category]?.icon
  //   : ShieldQuestion;
  // const currentColor = selectedItem
  //   ? ProductCategoriesStyles[selectedItem.category]?.color
  //   : "bg-blue-500";

  const actionStyle =
    ProductActionsStyles[
      selectedItem?.action || ProductActions.BuyChallengeAttempt
    ];
  const ActionIcon = actionStyle.icon;
  const ActionColor = actionStyle.color;

  const getMaxPurchaseForCurrentProduct = (): number => {
    if (!selectedItem) return 0;

    const foundItemOnInventory = inventory.find(
      (item) => item.product.id === selectedItem.id
    );

    if (!foundItemOnInventory) {
      return user.ruby >= selectedItem.price * selectedItem.max_purchases
        ? selectedItem.max_purchases
        : Math.floor(user.ruby / selectedItem.price);
    }

    return selectedItem.max_purchases - foundItemOnInventory.quantity;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="max-w-2xl">
        {selectedItem && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <span className={`p-2 rounded-lg bg-opacity-25 ${ActionColor}`}>
                  <ActionIcon className="h-6 w-6" />
                </span>
                <div>
                  <DialogTitle className="text-2xl">
                    {selectedItem.name}
                  </DialogTitle>
                  <Badge
                    className={`${ActionColor} text-accent border-0 `}
                    variant="outline"
                  >
                    {selectedItem.category}
                  </Badge>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              <DialogDescription className="text-base leading-relaxed">
                {selectedItem.description}
              </DialogDescription>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="text-ctf-red"
                  >
                    <Gem className="h-4 w-4 mr-1" />
                    {selectedItem.price} Ruby cada
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm">Seus Rubys</p>
                  <p className="font-semibold">{user.ruby}</p>
                </div>
              </div>

              <form action={handlePurchase} className="space-y-4">
                <div>
                  <Label
                    htmlFor="quantity"
                    className="mb-2 block"
                  >
                    Quantidade
                  </Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    step={1}
                    max={getMaxPurchaseForCurrentProduct()}
                    disabled={getMaxPurchaseForCurrentProduct() <= 0}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Number.parseInt(e.target.value))
                    }
                    className="w-full"
                    required
                  />
                  <p className="text-xs mt-1">
                    Máximo: {getMaxPurchaseForCurrentProduct()} unidade(s)
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-ctf-blue">
                  <div className="flex justify-between items-center">
                    <span className="text-ctf-blue font-medium">Total:</span>
                    <span className="text-ctf-blue font-bold text-lg">
                      {quantity ? selectedItem.price * quantity : "🤷🏻‍♂️"} Ruby
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm">Restará:</span>
                    <span
                      className={`text-sm font-medium ${
                        user.ruby - selectedItem.price * quantity >= 0
                          ? "text-ctf-green"
                          : "text-ctf-red"
                      }`}
                    >
                      {quantity
                        ? user.ruby - selectedItem.price * quantity
                        : "🤷🏻‍♂️"}{" "}
                      Ruby
                    </span>
                  </div>
                </div>

                <SubmitButton className="bg-ctf-blue text-secondary-foreground hover:bg-ctf-blue/85" disabled={getMaxPurchaseForCurrentProduct() <= 0}>
                  <ShoppingCart />
                  Comprar
                </SubmitButton>
              </form>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
