"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gem, ShoppingCart, Package, ShoppingBag } from "lucide-react";
import { ProductActions, ProductActionsStyles, ProductType, StoreGridProps } from "@/utils/types/store";
import StoreItemView from "./item-view";

export function StoreGrid({ items, user, inventory }: StoreGridProps) {
  const [selectedItem, setSelectedItem] = useState<ProductType | null>(null);

  const canAfford = (item: ProductType, qty: number) => {
    return user.ruby >= item.price * qty;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {!items || items.length == 0 ? (
          <div className="col-span-full text-center py-8">
            <ShoppingBag className="h-12 w-12 mx-auto mb-4" />
            <p>Nenhum produto disponível ainda</p>
            <p className="text-sm">Espere o administrador criar</p>
          </div>
        ) : (
          items.map((item, index) => {
            // const Icon = ProductCategoriesStyles[item?.category]?.icon ?? ShieldQuestion;
            // const currentColor = ProductCategoriesStyles[item?.category]?.color ?? "bg-blue-500";

            const actionStyle = ProductActionsStyles[item?.action || ProductActions.BuyChallengeAttempt];
            const ActionIcon = actionStyle.icon;
            const ActionColor = actionStyle.color;

            return (
              <Card
                key={index}
                className={`justify-between transition-all duration-200 hover:shadow-md hover:scale-[1.02] cursor-pointer ${
                  !item.hidden && !canAfford(item, 1) ? "opacity-60" : ""
                }`}
                onClick={() =>
                  !item.hidden && canAfford(item, 1) && setSelectedItem(item)
                }
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-2 flex-wrap justify-between">
                    <div className={`p-2 rounded-lg bg-opacity-25 ${ActionColor}`}><ActionIcon className="h-6 w-6" /></div>

                    <Badge
                      className={`${ActionColor} text-white border-0 `}
                      variant="outline"
                    >
                      {item.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    {item.name}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 justify-between">
                    <Badge
                      variant="outline"
                      className="text-ctf-red"
                    >
                      <Gem className="h-3 w-3 mr-1" />
                      {item.price} Ruby
                    </Badge>
                    <div className="flex items-center gap-1 text-xs">
                      <Package className="h-3 w-3" />
                      <span>{item.max_purchases} unidades por usuário</span>
                    </div>
                  </div>

                  <Button
                    className={`w-full ${ActionColor} text-white`}
                    disabled={!item.hidden && !canAfford(item, 1)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedItem(item);
                    }}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {!canAfford(item, 1) ? "Ruby Insuficiente" : "Comprar"}
                  </Button>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Purchase Dialog */}
      <StoreItemView
        open={!!selectedItem}
        onOpenChange={() => setSelectedItem(null)}
        selectedItem={selectedItem}
        user={user}
        inventory={inventory}
      />
    </>
  );
}
