"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Package, HandCoins, Gem } from "lucide-react";
import { InventoryList, ProductActions, ProductActionsStyles } from "@/utils/types/store";
import { useQuery } from "@tanstack/react-query";
import { getOwnedItems } from "@/utils/api/store";
import { Badge } from "@/components/ui/badge";

export function OwnedItems({ items }: { items: InventoryList }) {
  const {data} = useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<InventoryList> =>
      await getOwnedItems().then((data) => data.data),
    placeholderData: items,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString)
      .toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(",", " as");
  };

  if (!data || data.length == 0) {
    return (
      <div className="text-center py-8">
        <HandCoins className="h-12 w-12 mx-auto mb-4" />
        <p>Você não comprou nenhum produto ainda</p>
        <p className="text-sm">
          Compre qualquer produto através do catalogo acima
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data && data.length > 0 && data.map((purchase) => {
        // const Icon =
        //   ProductCategoriesStyles[purchase.product.category]?.icon ??
        //   ShieldQuestion;
        // const currentColor =
        //   ProductCategoriesStyles[purchase.product.category]?.color ??
        //   "bg-blue-500";

        const actionStyle = ProductActionsStyles[purchase.product?.action || ProductActions.BuyChallengeAttempt];
        const ActionIcon = actionStyle.icon;
        const ActionColor = actionStyle.color;

        
        return purchase.product && (
          <Card
            key={`${purchase.product.id}-${purchase.created_at}`}
            className="transition-all duration-200 hover:shadow-md"
          >
            <CardHeader className="gap-3">
              {/* <div className="flex items-center gap-3"> */}
              <CardTitle className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center justify-between gap-3 text-lg">
                    <div
                      className={`p-2 rounded-lg bg-opacity-25 ${ActionColor}`}
                    >
                      <ActionIcon className="h-6 w-6 text-white" />
                    </div>
                    {purchase.product.name}
                  </div>

                  <div className="text-red-500 flex gap-2 items-center">
                    <Gem className="w-5 h-5"/>
                    {(purchase.quantity * purchase.product.price)}</div>
                </div>

                <Badge
                  className={`${ActionColor} text-accent border-0 `}
                  variant="outline"
                >
                  {purchase.product.category}
                </Badge>
              </CardTitle>
              {/* </div> */}

              <CardDescription>{purchase.product.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span className="font-medium">
                    Quantidade: {purchase.quantity}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span>Comprado em: {formatDate(purchase.updated_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
