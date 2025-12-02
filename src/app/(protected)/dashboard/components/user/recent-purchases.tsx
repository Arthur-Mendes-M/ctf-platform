import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/utils/datetime'
import { UserDashboardResponseType } from '@/utils/types/dashboard'
import { PurchaseType } from '@/utils/types/store'
import { Calendar, Gem, ShoppingBag } from 'lucide-react'
import React from 'react'

export default function LastRecentPurchases({stats}: {stats: UserDashboardResponseType | null}) {
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Últimas Compras
            </CardTitle>
            <CardDescription>Seus itens comprados recentemente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats && stats?.last_purchases?.length > 0 ? (
                stats.last_purchases.map((purchase: PurchaseType, index: number) => {
                  return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {purchase.product.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-3 w-3" />
                        <span className="text-xs">
                          {formatDate(purchase.created_at)}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-ctf-red ml-2"
                    >
                      <Gem className="h-3 w-3 mr-1" />
                      {purchase.price}
                    </Badge>
                  </div>
                )})
              ) : (
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 mx-auto mb-4" />
                  <p>Nenhuma compra realizada ainda</p>
                  <p className="text-sm">
                    Visite a loja para adquirir benefícios!
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
  )
}
