import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserDashboardResponseType } from "@/utils/types/dashboard";
import { LoggedUserType } from "@/utils/types/user";
import { Gem, Target, Trophy, Zap } from "lucide-react";


export default function GeneralStatistics({stats, user}: {stats: UserDashboardResponseType | null, user: LoggedUserType}) {  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              XP Total
            </CardTitle>
            <Zap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user?.xp?.toLocaleString() ?? "Desconhecido"}
            </div>
            <p className="text-xs mt-2">
              De XP total
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ruby Disponível
            </CardTitle>
            <Gem className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.ruby?.toLocaleString() ?? "Desconhecido"}</div>
            <Badge
              variant="outline"
              className=" text-ctf-red mt-2"
            >
              Moeda do jogo
            </Badge>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Desafios concluídos
            </CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.correct_answers ?? "Desconhecido"}
            </div>
            <p className="text-xs mt-2">
              Com sucesso | à ser feito: {stats?.available_challenges ?? "Desconhecido"}
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Posição no Ranking
            </CardTitle>
            <Trophy className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              #{stats?.position ?? "Desconhecido"}
            </div>
            <Badge
              variant="outline"
              className=" text-ctf-blue mt-2"
            >
              Top 10
            </Badge>
          </CardContent>
        </Card>
      </div>
  )
}
