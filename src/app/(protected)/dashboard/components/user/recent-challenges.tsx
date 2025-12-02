import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/utils/datetime'
import { ChallengeDashboardType } from '@/utils/types/challenge'
import { UserDashboardResponseType } from '@/utils/types/dashboard'
import { Award, Calendar, Gem, Swords, Zap } from 'lucide-react'
import React from 'react'

export default function LastRecentChallenges({stats}: {stats: UserDashboardResponseType | null}) {
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Últimos Desafios acertados
            </CardTitle>
            <CardDescription>Seus 5 desafios mais recentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats && stats?.last_challenges.length > 0 ? (
                stats.last_challenges.map(
                  (challengeStats: ChallengeDashboardType) => (
                    <div
                      key={challengeStats.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {challengeStats.challenge.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-3 w-3" />
                          <span className="text-xs">
                            {formatDate(challengeStats.solved_date)}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 flex-wrap items-center">
                        <Badge
                          variant="outline"
                          className="border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors"
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          {challengeStats.challenge.xp.toLocaleString()}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Gem className="h-3 w-3 mr-1" />
                          {challengeStats.challenge.ruby}
                        </Badge>
                      </div>
                    </div>
                  )
                )
              ) : (
                <div className="text-center py-8">
                  <Swords className="h-12 w-12 mx-auto mb-4" />
                  <p>Nenhum desafio realizado ainda</p>
                  <p className="text-sm">
                    Vá até a página de desafios e teste seus conhecimentos!
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
  )
}
