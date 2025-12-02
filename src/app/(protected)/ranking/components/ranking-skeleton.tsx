import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function RankingPodiumSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      {[1, 2, 3].map((i) => (
        <Card key={i} className={i === 2 ? "md:order-2 md:scale-105" : i === 1 ? "md:order-1" : "md:order-3"}>
          <CardContent className="p-6 text-center">
            <Skeleton className="h-6 w-6 mx-auto mb-4" />
            <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
            <Skeleton className="h-6 w-32 mx-auto mb-2" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-20 mx-auto" />
              <Skeleton className="h-6 w-24 mx-auto" />
            </div>
            <div className="mt-4 space-y-1">
              <Skeleton className="h-4 w-16 mx-auto" />
              <Skeleton className="h-4 w-28 mx-auto" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function RankingListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 max-w-4xl mx-auto">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 min-w-[80px]">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-8" />
              </div>
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 min-w-0">
                <Skeleton className="h-5 w-32 mb-2" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <Skeleton className="h-4 w-8 mb-1" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
