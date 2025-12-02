"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminDashboardResponseType } from "@/utils/types/dashboard";
import {
  ChallengeCategories,
  ChallengeCategoriesStyles,
} from "@/utils/types/challenge";
import { Swords } from "lucide-react";

export default function PopularCategories({
  stats,
}: {
  stats?: AdminDashboardResponseType;
}) {
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle>Categorias Mais Populares</CardTitle>
        <CardDescription>
          Distribuição de desafios por categoria
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {!stats || !stats?.category_list || stats?.category_list?.length == 0 ? (
            <div className="text-center py-8">
              <Swords className="h-12 w-12 mx-auto mb-4" />
              <p>Nenhum desafio realizado ainda</p>
              <p className="text-sm">
                As categorias populares são baseadas nas tentativas de submissão dos desafios
              </p>
            </div>
          ) : (
            stats.category_list.map((category, index) => {
              const style =
                ChallengeCategoriesStyles[category.name as ChallengeCategories];
              const Icon = style.icon;
              // const text = style.color.replace("bg", "text");

              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className="w-8 h-8 rounded-full flex items-center justify-center p-0"
                    >
                      <Icon />
                    </Badge>
                    <span className="font-medium">
                      {category.name}
                    </span>
                  </div>
                  <Badge variant="outline" className={`border-none`}>
                    {category.quantity} desafios
                  </Badge>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
