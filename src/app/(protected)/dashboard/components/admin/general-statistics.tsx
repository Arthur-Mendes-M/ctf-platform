"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminDashboardResponseType } from "@/utils/types/dashboard";

import { Users, Target, ShoppingCart, TrendingUp } from "lucide-react";

export default function GeneralStatistics({stats}: {stats?: AdminDashboardResponseType}) {
  const xp_sum = stats ? stats?.users.reduce((prevAvg, currentUser) => prevAvg+currentUser.xp, 0) : 0
  const xp_average = stats ? (xp_sum/stats.users.length) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="transition-all duration-200 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Usuários
          </CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats?.users?.length ?? "??"}
          </div>
          <p className="text-xs mt-2">Usuários registrados</p>
        </CardContent>
      </Card>

      <Card className="transition-all duration-200 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Desafios
          </CardTitle>
          <Target className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats?.total_challenge ?? "??"}
          </div>
          <p className="text-xs mt-2">Desafios disponíveis</p>
        </CardContent>
      </Card>

      <Card className="transition-all duration-200 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Transações na Loja
          </CardTitle>
          <ShoppingCart className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats?.total_transaction ?? "??"}
          </div>
          <p className="text-xs mt-2">Compras realizadas</p>
        </CardContent>
      </Card>

      <Card className="transition-all duration-200 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            XP Médio
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {xp_average.toLocaleString() ?? "??"}
          </div>
          <p className="text-xs mt-2">Por usuário</p>
        </CardContent>
      </Card>
    </div>
  );
}
