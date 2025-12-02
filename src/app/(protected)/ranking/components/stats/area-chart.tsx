"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RankingUser } from "@/utils/types/user";
import {
  TrendingUp,
  Target,
  Zap,
  Gem,
  Award,
  Calendar,
  Swords,
  ClipboardList,
} from "lucide-react";

export function ChartAreaStats({ user }: { user: RankingUser }) {
  // Calculate real statistics from user data
  const totalChallenges = user.solved_challenges?.length || 0;
  const totalExams = user.solved_exams?.length || 0;

  // Calculate average scores from exams if available
  const examScores =
    user.solved_exams
      ?.map((exam) => exam.score)
      .filter((score) => score !== undefined) || [];
  const averageExamScore =
    examScores.length > 0
      ? Math.round(
          examScores.reduce((sum, score) => sum + score, 0) / examScores.length
        )
      : 0;

  // Get challenge categories distribution
  const challengesByCategory =
    user.solved_challenges?.reduce((acc, challenge) => {
      const category = challenge.category || "Outros";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

  const topCategory =
    Object.entries(challengesByCategory).sort(
      ([, a], [, b]) => b - a
    )[0]?.[0] || "Nenhuma";

  return (
    <Card className="flex-1 min-w-[400px]">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Estatísticas Gerais
        </CardTitle>
        <CardDescription>Resumo do desempenho do usuário</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center flex-wrap gap-4 mb-6">
          <div className="text-center p-4 bg-muted/50 rounded-lg min-w-[100px] grow">
            <div className="flex items-center justify-center mb-2">
              <Zap className="h-6 w-6 text-chart-2" />
            </div>
            <p className="text-3xl font-bold text-chart-2">
              {user.xp.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">XP Total</p>
          </div>

          <div className="text-center p-4 bg-muted/50 rounded-lg min-w-[100px] grow">
            <div className="flex items-center justify-center mb-2">
              <Gem className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-red-600">
              {user.ruby.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Rubies</p>
          </div>

          <div className="text-center p-4 bg-muted/50 rounded-lg min-w-[100px] grow">
            <div className="flex items-center justify-center mb-2">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-600">
              {totalChallenges}
            </p>
            <p className="text-sm text-muted-foreground">Desafios Resolvidos</p>
          </div>

          <div className="text-center p-4 bg-muted/50 rounded-lg min-w-[100px] grow">
            <div className="flex items-center justify-center mb-2">
              <Award className="h-6 w-6 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-orange-600">{totalExams}</p>
            <p className="text-sm text-muted-foreground">Exames Realizados</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Categoria Favorita
              </h4>
              <p className="text-2xl font-bold text-purple-600">
                {topCategory}
              </p>
              <p className="text-sm text-muted-foreground">
                {challengesByCategory[topCategory] || 0} desafios resolvidos
              </p>
            </div>

            {/* {examScores.length > 0 && ( */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Média em Exames
              </h4>
              <p className="text-2xl font-bold text-orange-600">
                {averageExamScore}%
              </p>
              <p className="text-sm text-muted-foreground">
                Baseado em {examScores.length} exame(s)
              </p>
            </div>
            {/* )} */}
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Conquistas</h4>
            <div className="flex flex-wrap gap-2">
              {user.xp >= 5000 && (
                <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  <Zap className="h-3 w-3" />
                  Expert ({user.xp.toLocaleString()} XP)
                </div>
              )}
              {totalChallenges >= 10 && (
                <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  <Target className="h-3 w-3" />
                  Solucionador ({totalChallenges} desafios)
                </div>
              )}
              {totalExams >= 3 && (
                <div className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  <Award className="h-3 w-3" />
                  Examinado ({totalExams} exames)
                </div>
              )}
              {user.ruby >= 1000 && (
                <div className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                  <Gem className="h-3 w-3" />
                  Rico ({user.ruby.toLocaleString()} rubies)
                </div>
              )}
              {Object.keys(challengesByCategory).length >= 3 && (
                <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  <Calendar className="h-3 w-3" />
                  Versátil ({Object.keys(challengesByCategory).length}{" "}
                  categorias)
                </div>
              )}
            </div>

            <div className="w-full px-2 py-4 bg-accent rounded-md opacity-50 flex flex-wrap gap-3 items-center justify-between text-sm">
              <Swords />
              <h5>Conquistando mais</h5>
              <ClipboardList />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
