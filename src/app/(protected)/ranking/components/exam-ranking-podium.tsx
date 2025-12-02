"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Crown, Medal, Award, ShieldQuestion, AArrowUp } from "lucide-react"
import type { ExamRankingPodiumProps } from "@/utils/types/user"

export function ExamRankingPodium({ topThree, currentUserEmail }: ExamRankingPodiumProps) {
  if(!topThree || !currentUserEmail) return

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />
      default:
        return null
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
        return "bg-blue-100 text-blue-800 border-blue-300"
    }
  }

  // Reorganizar para ter 1º no centro
  const [first, second, third] = topThree
  const podiumOrder = [second, first, third]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      {podiumOrder.map((user, userPosition) => {
        const isFirst = userPosition + 1 === 1
        const isCurrentUser = user?.email === currentUserEmail

        return (
          <Card
            key={userPosition}
            className={`transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${
              isFirst ? "md:order-2" : "md:order-3"
            } ${isCurrentUser ? "ring-2 ring-ctf-blue ring-offset-2" : ""} ${!user && "opacity-50"}`}
          >
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                {!user ? <ShieldQuestion className="text-ctf-blue" /> : getPositionIcon(topThree.indexOf(user) + 1)}
              </div>

              <Avatar className="h-16 w-16 mx-auto mb-4">
                <AvatarImage src={user?.avatar_url || ""} alt={user?.name} />
                <AvatarFallback className="text-lg font-semibold">
                  {!user ? "?" : user?.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <h3 className="text-lg font-bol mb-2">{!user ? "A ser conquistado" : user?.name ?? "Desconhecido"}</h3>

              <div className="flex gap-3 items-center justify-center">
                {user ? (
                  <>
                    <Badge className={`${getPositionBadge(topThree.indexOf(user) + 1)} font-semibold`}>
                      {topThree.indexOf(user) + 1}º Lugar
                    </Badge>

                    <Badge variant="outline" className="text-ctf-blue font-semibold">
                      <AArrowUp className="" />
                      {user?.score} Nota
                    </Badge>
                  </>
                ) : (
                  "A ser conquistado"
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
