"use client"

import PopularCategories from "./popular-categories";
import GeneralStatistics from "./general-statistics";
import { getAdminStats } from "@/utils/api/admin";
import UsersList from "./users-list";
import { useQuery } from "@tanstack/react-query";
import { AdminDashboardResponseType } from "@/utils/types/dashboard";

export default function AdminDashboard() {
  const { data: stats } = useQuery<AdminDashboardResponseType>({
    queryKey: ["admin-stats"],
    queryFn: getAdminStats
  });

  return (
    <div className="space-y-8">
      <GeneralStatistics stats={stats} />

      <PopularCategories stats={stats} />

      <UsersList stats={stats} />
    </div>
  );
}
