import {
  RankingPodiumSkeleton,
  RankingListSkeleton,
} from "@/app/(protected)/ranking/components/ranking-skeleton";

export default function RankingLoading() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse mb-2" />
        <div className="h-5 w-64 bg-slate-200 rounded animate-pulse" />
      </div>

      {/* Pódio Skeleton */}
      <div className="mb-12">
        <div className="h-6 w-24 bg-slate-200 rounded animate-pulse mb-6" />
        <RankingPodiumSkeleton />
      </div>

      {/* Lista Skeleton */}
      <div>
        <div className="h-6 w-24 bg-slate-200 rounded animate-pulse mb-6" />
        <RankingListSkeleton />
      </div>
    </main>
  );
}
