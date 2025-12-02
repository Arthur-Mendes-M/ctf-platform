"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChallengeType } from "@/utils/types/challenge"
import { ExamType } from "@/utils/types/exam"
import { RankingUser } from "@/utils/types/user"

export function ChartBarStats({ user }: { user: RankingUser }) {
  const generateCategoryData = (solvedChallenges: ChallengeType[] | null = null) => {
    const categories: Record<string, number> = {}

    if (solvedChallenges) {
      solvedChallenges.forEach((challenge) => {
        categories[challenge.category] = (categories[challenge.category] || 0) + 1
      })
    }

    return Object.entries(categories).map(([category, count]) => ({
      category,
      solved: count,
    }))
  }

  const getMostSolvedChallengeDifficulty = (solvedChallenges: ChallengeType[] | null = null) => {
    if (!solvedChallenges || solvedChallenges.length === 0) return null

    const difficulties: Record<string, number> = {}
    solvedChallenges.forEach((challenge) => {
      difficulties[challenge.difficulty!] = (difficulties[challenge.difficulty!] || 0) + 1
    })

    const mostSolved = Object.entries(difficulties).reduce(
      (max, [difficulty, count]) => (count > max.count ? { difficulty, count } : max),
      { difficulty: "", count: 0 },
    )

    return mostSolved.count > 0 ? mostSolved : null
  }

  const getMostSolvedExamDifficulty = (solvedExams: ExamType[] | null = null) => {
    if (!solvedExams || solvedExams.length === 0) return null

    const difficulties: Record<string, number> = {}
    solvedExams.forEach((exam) => {
      difficulties[exam.difficulty] = (difficulties[exam.difficulty] || 0) + 1
    })

    const mostSolved = Object.entries(difficulties).reduce(
      (max, [difficulty, count]) => (count > max.count ? { difficulty, count } : max),
      { difficulty: "", count: 0 },
    )

    return mostSolved.count > 0 ? mostSolved : null
  }

  const getSuccessFailureStats = () => {
    const totalSolved = (user.solved_challenges?.length || 0) + (user.solved_exams?.length || 0)
    const totalFailed = (user?.solved_challenges?.map(challenge => !challenge.solved).length || 0) + (user?.solved_exams?.map(exam => !exam.solved)?.length || 0)

    return {
      solved: totalSolved,
      failed: totalFailed,
      successRate: totalSolved + totalFailed > 0 ? Math.round((totalSolved / (totalSolved + totalFailed)) * 100) : 0,
    }
  }

  const generateExamStats = (solvedExams: ExamType[] | null = null) => {
    const solvedCount = solvedExams?.length || 0
    const avgScore = solvedExams?.length
      ? Math.round(solvedExams.reduce((sum, exam) => sum + (exam.score || 0), 0) / solvedExams.length)
      : 0

    return {
      solved: solvedCount,
      avgScore,
    }
  }

  const challengeData = generateCategoryData(user.solved_challenges)
  const examStats = generateExamStats(user.solved_exams)
  const totalChallengesSolved = challengeData.reduce((sum, item) => sum + item.solved, 0)

  const mostSolvedChallengeDifficulty = getMostSolvedChallengeDifficulty(user.solved_challenges)
  const mostSolvedExamDifficulty = getMostSolvedExamDifficulty(user.solved_exams)
  const successFailureStats = getSuccessFailureStats()

  return (
    <Card className="flex-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Estatísticas do Usuário</CardTitle>
        <CardDescription className="text-sm">
          {totalChallengesSolved} desafios • {examStats.solved} exames • {user.xp} XP • {user.ruby} rubies
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Desempenho Geral</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-950/20 rounded">
              <span className="text-sm font-medium">Resolvidos</span>
              <span className="text-sm text-green-600 dark:text-green-400">{successFailureStats.solved}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-950/20 rounded">
              <span className="text-sm font-medium">Fracassados</span>
              <span className="text-sm text-red-600 dark:text-red-400">{successFailureStats.failed}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-950/20 rounded">
              <span className="text-sm font-medium">Taxa Sucesso</span>
              <span className="text-sm text-blue-600 dark:text-blue-400">{successFailureStats.successRate}%</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t space-y-3">
          <h4 className="text-sm font-medium">Dificuldades Favoritas</h4>
          <div className="grid grid-cols-2 gap-3">
            {/* {mostSolvedChallengeDifficulty && ( */}
              <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                <span className="text-sm font-medium">Desafios</span>
                <span className="text-sm text-muted-foreground">
                  {mostSolvedChallengeDifficulty?.difficulty ?? 0} ({mostSolvedChallengeDifficulty?.count ?? 0})
                </span>
              </div>
            {/* )} */}
            {/* {mostSolvedExamDifficulty && ( */}
              <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                <span className="text-sm font-medium">Exames</span>
                <span className="text-sm text-muted-foreground">
                  {mostSolvedExamDifficulty?.difficulty ?? 0} ({mostSolvedExamDifficulty?.count ?? 0})
                </span>
              </div>
            {/* )} */}
          </div>
        </div>

        {/* {challengeData.length > 0 && ( */}
          <div className="pt-3 border-t space-y-3">
            <h4 className="text-sm font-medium">Desafios por Categoria</h4>
            <div className="grid grid-cols-2 gap-3">
              {challengeData.length > 0 ? challengeData.map((item) => (
                <div key={item.category} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <span className="text-sm font-medium">{item.category}</span>
                  <span className="text-sm text-muted-foreground">{item.solved}</span>
                </div>
              )) : (
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded opacity-75">
                <span className="text-sm font-italic">Nenhum por enquanto</span>
              </div>
              )}
            </div>
          </div>
        {/* )} */}

        {/* {examStats.solved > 0 && ( */}
          <div className="pt-3 border-t space-y-3">
            <h4 className="text-sm font-medium">Estatísticas de Exames</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                <span className="text-sm font-medium">Resolvidos</span>
                <span className="text-sm text-muted-foreground">{examStats.solved ?? 0}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                <span className="text-sm font-medium">Nota Média</span>
                <span className="text-sm text-muted-foreground">{examStats.avgScore ?? 0}%</span>
              </div>
            </div>
          </div>
        {/* )} */}

        <div className="pt-3 border-t space-y-3">
          <h4 className="text-sm font-medium">Métricas Gerais</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
              <span className="text-sm font-medium">XP Total</span>
              <span className="text-sm text-muted-foreground">{user.xp}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
              <span className="text-sm font-medium">Rubies</span>
              <span className="text-sm text-muted-foreground">{user.ruby}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
