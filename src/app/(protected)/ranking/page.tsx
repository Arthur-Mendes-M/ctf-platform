"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RankingPodium } from "./components/ranking-podium";
import { RankingList } from "./components/ranking-list";
// import {
//   RankingPodiumSkeleton,
//   RankingListSkeleton,
// } from "./components/ranking-skeleton";
import {
  BarChartIcon as ChartNoAxesCombined,
  //Construction,
  LandPlot,
  Medal,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import type { RankingExamsType } from "@/utils/types/exam";
import { useQuery } from "@tanstack/react-query";
import { getUserSession } from "@/utils/cookies";
import { getUsersByXp } from "@/utils/api/user";
import { getAllRankingExams } from "@/utils/api/exam";
import RankingLoading from "./loading";
import { useSearchParams } from "next/navigation";
import { ExamRankingPodium } from "./components/exam-ranking-podium";
import { ExamRankingList } from "./components/exam-ranking-list";

export default function RankingPage() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab");
  const currentExam = searchParams.get("exam_id");

  const [selectExam, setSelectExam] = useState(currentExam || "");

  const { data: sessionContext, isLoading: isUserLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getUserSession,
  });

  const { data: rankingByXp, isLoading: isRankingLoading } = useQuery({
    queryKey: ["rankingByXp"],
    queryFn: getUsersByXp,
  });

  const { data: rankingExams, isLoading: isExamsRankingLoading } = useQuery({
    queryKey: ["rankingByExam"],
    queryFn: getAllRankingExams,
    //enabled: !!currentExam,
  });

  const currentUserEmail = sessionContext?.user.email;
  const generalTopThreeByXp = rankingByXp?.data
    ? rankingByXp.data?.slice(0, 3)
    : null;
  const generalTopTenByXp = rankingByXp?.data
    ? rankingByXp.data?.slice(0, 10)
    : null;

  const selectedExamObj: RankingExamsType = rankingExams?.find(
    (exam: RankingExamsType) => exam.id === selectExam
  );
  const topThreeExams = selectedExamObj?.ranking.slice(0, 3) ?? [];
  const rankingExamsList = selectedExamObj?.ranking ?? [];

  if (
    isUserLoading ||
    isRankingLoading ||
    !currentUserEmail ||
    isExamsRankingLoading
  ) {
    return <RankingLoading />;
  }

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex gap-3 items-center">
          <LandPlot className="w-8 h-8" /> Ranking CTF
        </h1>
        <p>Os melhores hackers da arena</p>
      </div>

      <Tabs
        defaultValue={
          (currentTab &&
            ["general", "exams", "challenges"].includes(currentTab) &&
            currentTab) ||
          "general"
        }
        className="w-full"
      >
        <TabsList className="w-full mb-8 grid grid-cols-2">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden md:inline">Ranking Geral</span>
          </TabsTrigger>

          <TabsTrigger value="exams" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            <span className="hidden md:inline">Ranking por Prova</span>
          </TabsTrigger>
        </TabsList>

        {/* ranking geral por xp */}
        <TabsContent value="general" className="space-y-8">
          {!sessionContext.user && isUserLoading && (
            <div className="text-center py-8">
              <Medal className="h-12 w-12 mx-auto mb-4" />
              <p>No momento ainda não existe pódio</p>
              <p className="text-sm">
                Responda o máximo de desafios corretamente possível e entre no
                ranking!
              </p>
            </div>
          )}
          {/* Pódio Geral */}
          <div>
            <h2 className="text-xl font-semibold mb-6 flex gap-3 items-center">
              <TrendingUp className="w-5 h-5" /> Pódio Geral
            </h2>

            {!generalTopThreeByXp || generalTopThreeByXp.length === 0 ? (
              <div className="text-center py-8">
                <Medal className="h-12 w-12 mx-auto mb-4" />
                <p>No momento ainda não existe pódio</p>
                <p className="text-sm">
                  Responda o máximo de desafios corretamente possível e entre no
                  ranking!
                </p>
              </div>
            ) : (
              <RankingPodium
                topThree={generalTopThreeByXp}
                currentUserEmail={currentUserEmail}
              />
            )}
          </div>

          {/* Top 10 Geral */}
          <div>
            <h2 className="text-xl font-semibold mb-6 flex gap-3 items-center">
              <ChartNoAxesCombined className="w-5 h-5" /> Top 10 Geral
            </h2>

            {!generalTopTenByXp || generalTopTenByXp.length === 0 ? (
              <div className="text-center py-8">
                <Medal className="h-12 w-12 mx-auto mb-4" />
                <p>No momento ainda não existe top 10</p>
                <p className="text-sm">
                  Responda o máximo de desafios corretamente possível e entre no
                  ranking!
                </p>
              </div>
            ) : (
              <RankingList
                ranking={generalTopTenByXp}
                currentUserEmail={currentUserEmail}
              />
            )}
          </div>
        </TabsContent>

        {/* ranking por prova */}
        <TabsContent value="exams" className="space-y-8">
          <div className="flex items-center gap-4 mb-6">
            <label
              htmlFor="contest-select"
              className="text-sm font-medium"
            >
              Selecionar Prova:
            </label>
            <Select
              value={selectExam}
              onValueChange={(examId) => {
                setSelectExam(examId);
              }}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Escolha uma prova" />
              </SelectTrigger>
              <SelectContent>
                {rankingExams && rankingExams.length > 0 && rankingExams.map((exam: RankingExamsType) => (
                  <SelectItem key={exam.id} value={exam.id}>
                    {exam.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <>
            <div>
              <h2 className="text-xl font-semibold mb-6 flex gap-3 items-center">
                <TrendingUp className="w-5 h-5" /> Pódio da Prova
              </h2>

              {topThreeExams.length === 0 ? (
                <div className="text-center py-8">
                  <Medal className="h-12 w-12 mx-auto mb-4" />
                  <p>Esta prova ainda não possui pódio</p>
                  <p className="text-sm">
                    Seja o primeiro a participar desta prova!
                  </p>
                </div>
              ) : (
                <ExamRankingPodium
                  topThree={topThreeExams}
                  currentUserEmail={currentUserEmail}
                />
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-6 flex gap-3 items-center">
                <ChartNoAxesCombined className="w-5 h-5" /> Ranking da Prova
              </h2>

              {rankingExamsList.length === 0 ? (
                <div className="text-center py-8">
                  <Medal className="h-12 w-12 mx-auto mb-4" />
                  <p>Esta prova ainda não possui participantes</p>
                  <p className="text-sm">
                    Seja o primeiro a participar desta prova!
                  </p>
                </div>
              ) : (
                <ExamRankingList
                  ranking={rankingExamsList}
                  currentUserEmail={currentUserEmail}
                />
              )}
            </div>
          </>
        </TabsContent>
      </Tabs>
    </div>
  );
}
