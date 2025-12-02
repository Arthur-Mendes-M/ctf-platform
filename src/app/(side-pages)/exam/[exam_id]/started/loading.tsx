"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-subtle animate-pulse">
      {/* Header */}
      <div className="border-b border-border bg-background px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col gap-2">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-6 p-6 flex-wrap max-w-7xl mx-auto">
        {/* Question Panel */}
        <div className="flex-1 min-w-1/2">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-8 w-20" />
            </div>
            <Progress value={0} className="mb-4" />
          </div>

          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-2/3" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
              <Skeleton className="h-4 w-3/6" />
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-end flex-wrap gap-3 mt-6">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="grow md:grow-0 md:w-80">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg">
                <Skeleton className="h-5 w-24" />
              </CardTitle>
              <div className="flex items-center gap-4 text-sm">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Progress value={0} />
            </CardHeader>
            <CardContent>
              <div className="flex items-center flex-wrap gap-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-8 rounded" />
                ))}
              </div>
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-3 h-3 rounded-full" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="w-3 h-3 rounded-sm" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
