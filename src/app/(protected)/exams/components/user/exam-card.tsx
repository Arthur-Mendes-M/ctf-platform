"use client";

import { getDifficultyBadge } from "@/app/(protected)/challenge/components/challenge-styles";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChallengeCategoriesStyles } from "@/utils/types/challenge";
import { ExamFilteredType, getExamStatus } from "@/utils/types/exam";
import {
  AlertCircle,
  ArrowUpRight,
  ChartNoAxesCombined,
  Clock,
  Gem,
  LucideProps,
  Medal,
  ShieldQuestion,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import Link from "next/link";
import { Button } from "@/components/ui/button";
import { differenceInMinutes } from "date-fns";
import { updateUserSession } from "@/utils/cookies";
import { redirect, RedirectType, useSearchParams } from "next/navigation";
import { calcFormattedDiffBetweenDates, formatDate } from "@/utils/datetime";
import Link from "next/link";


const ExamCardPreview = ({exam, Icon, currentColor}: {exam:ExamFilteredType, Icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>, currentColor: string}) => {
  return (
    <Card
      className={`relative h-full justify-between overflow-hidden transition-all hover:shadow-lg cursor-pointer`}
    >
      <div className={`absolute top-0 left-0 right-0 h-1 ${currentColor}`} />

      <CardHeader className="pb-3 text-start items-start">
        <div className="flex items-start justify-between">
          <div className="flex items-center flex-wrap gap-x-3 gap-y-2">
            <div className={`p-2 rounded-lg bg-opacity-25 ${currentColor}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <Badge variant="outline">{exam.category}</Badge>
            {getExamStatus(exam) === "Em andamento" ||
              (getExamStatus(exam) === "Concluído" && (
                <Link href={`/ranking?tab=exams&exam_id=${exam.id}`}>
                  <Badge variant="outline" className="items-center">
                    {exam.ranking_position ? (
                      <>
                        <Medal className="w-3 h-3" />
                        {exam.ranking_position}° no ranking
                      </>
                    ) : (
                      <>
                        <ChartNoAxesCombined className="w-3 h-3" />
                        Ver ranking
                      </>
                    )}
                    <ArrowUpRight className="w-3 h-3" />
                  </Badge>
                </Link>
              ))}
          </div>
          {getDifficultyBadge(exam.difficulty!)}
        </div>
        <CardTitle className="text-lg">
          {exam.title || "Desconhecido"}
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed text-muted-foreground">
          {exam.description ?? "Nenhuma descrição disponível."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center flex-wrap gap-2 justify-between text-sm">
            <span className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-blue-700" />
              XP Reward
            </span>
            <span className="font-bold text-blue-700">
              {exam.xp.toLocaleString()} XP
            </span>
          </div>

          <div className="flex items-center flex-wrap gap-2 justify-between text-sm">
            <span className="flex items-center gap-1">
              <Gem className="h-4 w-4 text-red-500" />
              Recompensa
            </span>
            <Badge className="text-red-600 bg-transparent border-red-200">
              {exam.ruby.toLocaleString()} Ruby&apos;s
            </Badge>
          </div>

          <div className="flex items-center flex-wrap gap-2 justify-between text-sm">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-blue-500" />
              Começa
            </span>
            <span className="font-medium opacity-60">
              {formatDate(exam.starts_at, true)}
            </span>
          </div>
          <div className="flex items-center flex-wrap gap-2 justify-between text-sm">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-blue-500" />
              Termina
            </span>
            <span className="font-medium opacity-60">
              {formatDate(exam.ends_at, true)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function ExamCard({ exam }: { exam: ExamFilteredType }) {
  const Icon =
    ChallengeCategoriesStyles[exam?.category]?.icon ?? ShieldQuestion;
  const currentColor =
    ChallengeCategoriesStyles[exam?.category]?.color ?? "bg-blue-500";
  
    const searchParams = useSearchParams();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleStartExamRedirect = async () => {
    setIsRedirecting(true);
    await updateUserSession({ current_exam: exam });
    redirect(`/exam/${exam.id}/started`, RedirectType.push);
  };

  const handleReviewExamRedirect = async () => {
    setIsRedirecting(true);
    await updateUserSession({ current_exam: exam });
    redirect(`/exam/${exam.id}/review`, RedirectType.push);
  };

  return (
    <Dialog
      defaultOpen={
        searchParams && searchParams.get("exam_open")
          ? exam.id === searchParams.get("exam_open")
          : false
      }
    >
      <DialogTrigger className="h-full">
        <ExamCardPreview exam={exam} Icon={Icon} currentColor={currentColor} />
      </DialogTrigger>

      <DialogContent className="px-0 md:px-4 max-h-[95vh] max-w-4xl overflow-x-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle className="sr-only">Prova: {exam.title}</DialogTitle>
          <DialogDescription className="sr-only">
            {exam.description}
          </DialogDescription>
        </DialogHeader>

        <Card className="shadow-none border-none max-w-2xl w-full">
          <CardHeader className="">
            <CardTitle className="text-2xl font-bold">{exam.title}</CardTitle>

            <CardDescription className="flex flex-wrap gap-x-3 gap-y-1">
              <Badge variant="outline" className="">
                {exam.category}
              </Badge>

              {getExamStatus(exam) === "Em andamento" ||
                (getExamStatus(exam) === "Concluído" && (
                  <Link href={`/ranking?tab=exams&exam_id=${exam.id}`}>
                    <Badge variant="outline" className="items-center">
                      {exam.ranking_position ? (
                        <>
                          <Medal className="w-3 h-3" />
                          {exam.ranking_position}° no ranking
                        </>
                      ) : (
                        <>
                          <ChartNoAxesCombined className="w-3 h-3" />
                          Ver ranking
                        </>
                      )}
                      <ArrowUpRight className="w-3 h-3" />
                    </Badge>
                  </Link>
                ))}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 border rounded-lg flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-primary">
                  {exam.exercises_quantity}
                </div>
                <div className="text-sm text-muted-foreground">Questões</div>
              </div>
              <div className="p-4 border rounded-lg flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-primary">
                  {getExamStatus(exam) === "Concluído"
                    ? calcFormattedDiffBetweenDates(
                        exam.initiated_at!,
                        exam.finished_at!
                      )
                    : getExamStatus(exam) === "Não realizado"
                    ? differenceInMinutes(
                        new Date(exam.ends_at),
                        new Date(exam.starts_at)
                      )
                    : // differenceInMinutes(new Date(exam.ends_at), new Date())
                      calcFormattedDiffBetweenDates(
                        new Date().toISOString(),
                        exam.ends_at
                      )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {getExamStatus(exam) === "Concluído"
                    ? "Tempo gasto"
                    : getExamStatus(exam) === "Não realizado"
                    ? "Tempo de duração"
                    : "Tempo restante"}
                </div>
              </div>
              <div className="p-4 border rounded-lg flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-primary">
                  {exam.solved ? exam.score : exam.grade}
                </div>
                <div className={`text-sm text-muted-foreground`}>
                  {exam.solved ? "Nota" : "Pontos"}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Instruções:</h3>
              <p className="text-muted-foreground">{exam.description}</p>

              <div className="p-4 rounded-lg border">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
                  <div>
                    <p className="font-medium">Importante:</p>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>• Uma vez iniciada, a prova não pode ser pausada</li>
                      <li>
                        • Certifique-se de ter uma conexão estável com a
                        internet
                      </li>
                      <li>• Suas respostas são salvas automaticamente</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {getExamStatus(exam) === "Em andamento" && (
              <div className="flex justify-center w-full">
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={isRedirecting}
                  onClick={handleStartExamRedirect}
                >
                  {isRedirecting ? (
                    "Redirecionando..."
                  ) : (
                    <>
                      Iniciar Prova
                      <ArrowUpRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            )}

            {getExamStatus(exam) !== "Em andamento" &&
              getExamStatus(exam) !== "Em breve" && (
                <div className="flex justify-center w-full">
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={
                      isRedirecting ||
                      (!exam.review_allowed &&
                      differenceInMinutes(new Date(), exam.ends_at) < 120)
                    }
                    onClick={handleReviewExamRedirect}
                  >
                    {isRedirecting ? (
                      "Redirecionando..."
                    ) : differenceInMinutes(new Date(), exam.ends_at) < 120 &&
                      !exam.review_allowed ? (
                      "Revisão disponível após 2 horas do término"
                    ) : (
                      <>
                        Revisar Prova
                        <ArrowUpRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
