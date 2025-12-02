import { getUserSession } from "@/utils/cookies";
import { getUserStats } from "@/utils/api/user";
import GeneralStatistics from "./general-statistics";
import LastRecentChallenges from "./recent-challenges";
import LastRecentPurchases from "./recent-purchases";
import { ROLES } from "@/utils/types/user";
import { UserDashboardResponseType } from "@/utils/types/dashboard";

export default async function UserDashboard() {
  const sessionContext = await getUserSession();
  const stats: UserDashboardResponseType | null = sessionContext.user.role === ROLES.USER ? await getUserStats() : null;
  

  return (
    <div className="space-y-8">
      <GeneralStatistics stats={stats} user={sessionContext.user} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LastRecentChallenges stats={stats} />

        <LastRecentPurchases stats={stats} />
      </div>
    </div>
  );
}
