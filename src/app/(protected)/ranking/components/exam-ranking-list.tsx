"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Crown, Medal, Award, Zap, Trophy } from "lucide-react"
import type { RankingUserExamType } from "@/utils/types/user";

export function ExamRankingList({ ranking, currentUserEmail }: { ranking : RankingUserExamType[], currentUserEmail: string }) {
  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <Trophy className="h-5 w-5 text-slate-400" />
    }
  }

  const getPositionBadge = (position: number) => {
    switch (position) {
      case 1:
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case 2:
        return "bg-gray-100 text-gray-800 border-gray-300"
      case 3:
        return "bg-amber-100 text-amber-800 border-amber-300"
      default:
        return "bg-slate-100 text-slate-800 border-slate-300"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 max-w-4xl mx-auto">
      {ranking.map((user, userPosition) => {
        const isCurrentUser = user.email === currentUserEmail

        return (
          <Card
            key={`${userPosition}-${user.email}`}
            className={`transition-all duration-200 hover:shadow-md hover:scale-[1.01] ${
              isCurrentUser ? "ring-2 ring-blue-500 ring-offset-2" : ""
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center flex-wrap gap-4">
                {/* Posição */}
                <div className="flex items-center gap-2 flex-wrap min-w-[80px]">
                  {getPositionIcon(userPosition + 1)}
                  <Badge className={`${getPositionBadge(userPosition + 1)} font-semibold`}>{userPosition + 1}º</Badge>
                </div>

                {/* Avatar */}
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar_url || ""} alt={user.name}/>
                  <AvatarFallback>
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Informações do usuário */}
                <div className="flex-1 min-w-24">
                  <h3 className="font-semibold truncate">{user.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="border-blue-200 text-blue-700 text-xs">
                      <Zap className="h-3 w-3 mr-1" />
                      {user.xp.toLocaleString()} XP
                    </Badge>
                  </div>
                </div>

                {/* Estatísticas */}
                <div className="text-right text-sm hidden md:block">
                  <p className="font-medium">{user.score.toLocaleString()}</p>
                  <p className="text-xs">Nota</p>
                </div>
              </div>        
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
