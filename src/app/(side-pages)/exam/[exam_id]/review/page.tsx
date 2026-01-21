"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ArrowUpRight,
  CircleX,
  Milestone,
} from "lucide-react";
import { ExamHeader } from "../components/exam-header";
import { redirect, useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFullExam } from "@/utils/api/exam";
import { ExamType } from "@/utils/types/exam";
import { cn } from "@/lib/utils";
import Loading from "./loading";
import ExamNotFound from "../not-found-exam";
import { SolvedQuestionCard } from "../components/solved-exam-question-card";
import { getUserSession } from "@/utils/cookies";
import { CurrentSessionType, ROLES } from "@/utils/types/user";
import { QuestionCard } from "../components/exam-question-card";
import { updateExam } from "@/utils/api/admin";
import { toast } from "sonner";

export default function ReviewExam() {
  const { exam_id } = useParams<{ exam_id: string }>();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showCurrentRightAnswer, setShowCurrentRightAnswer] = useState(false);
  const queryClient = useQueryClient();

  // const [reviewAllowed, setReviewAllowed] = useState(false);
  // const [answers, setAnswers] = useState<Record<string, string>>({});

  const { data: completedExam, isLoading } = useQuery<ExamType>({
    queryKey: ["completed-exam"],
    queryFn: async () => await getFullExam(exam_id),
    // enabled: !!exam_id,
    // staleTime: Infinity,
  });

  const reviewAllowed = completedExam?.review_allowed ?? false;

  const { mutate: updateReviewVisibilityExam, isPending: updatingExam } =
    useMutation({
      mutationKey: ["user-info"],
      mutationFn: async () =>
        await updateExam({
          newExam: { review_allowed: true },
          examId: exam_id,
        }),
      onSuccess: (data) => {
        if (data.success) {
          // setReviewAllowed(true)
          toast.success("Prova liberada para revisão!");
        
          queryClient.setQueryData<ExamType>(["completed-exam"], (old) =>
            old ? { ...old, review_allowed: true } : old
          );
        } else {
          toast.error("Algo deu errado!", {description: "Favor tente novamente em instantes."});
        }
      },
      // enabled: !!exam_id,
      // staleTime: Infinity,
    });

  const { data: userInfoQuery } = useQuery<CurrentSessionType>({
    queryKey: ["user-info"],
    queryFn: async () => await getUserSession(),
    // enabled: !!exam_id,
    // staleTime: Infinity,
  });

  // useEffect(() => {
  //   if(completedExam) {
  //     setReviewAllowed(completedExam.review_allowed)
  //   }
  // }, [completedExam])

  // const handleAnswerChange = (questionId: string, answer: string) => {
  //   setAnswers((prev) => ({
  //     ...prev,
  //     [questionId]: answer,
  //   }));
  // };

  const goToQuestion = (index: number) => {
    setShowCurrentRightAnswer(false);
    setCurrentQuestion(index);
  };

  const nextQuestion = () => {
    if (!completedExam) return;
    if (currentQuestion < completedExam.exercises.length - 1) {
      setShowCurrentRightAnswer(false);
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setShowCurrentRightAnswer(false);
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const rightAnsweredQuestions =
    completedExam?.exercises.filter(
      (exercise) => exercise.answer === exercise.user_answer
    ) || [];
  const progressPercentage =
    completedExam &&
    (rightAnsweredQuestions.length / completedExam.exercises.length) * 100;

  if (isLoading) {
    return <Loading />;
  }

  if (!completedExam && !isLoading) {
    return <ExamNotFound />;
  }

  if (completedExam) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        {/* Header */}
        <ExamHeader
          exam={completedExam}
          onFinish={() => {}}
          isAdmin={userInfoQuery?.user.role === ROLES.ADMIN}
        />

        {/* Main Content */}
        <div className="flex gap-6 p-6 flex-wrap max-w-7xl mx-auto">
          {/* Question Panel */}
          <div className="flex-1 min-w-[70%]">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  Questão {currentQuestion + 1} de{" "}
                  {completedExam.exercises.length}
                </h2>
              </div>

              <Progress
                value={
                  ((currentQuestion + 1) / completedExam.exercises.length) * 100
                }
                className={`transition-all`}
                progressIndicatorClassName={`rounded-xl ${
                  completedExam.exercises[currentQuestion].answer ===
                  completedExam.exercises[currentQuestion].user_answer
                    ? "bg-green-600"
                    : "bg-red-600"
                }`}
              />
            </div>

            {userInfoQuery?.user.role !== ROLES.ADMIN ||
            showCurrentRightAnswer ? (
              <SolvedQuestionCard
                question={
                  completedExam.exercises[currentQuestion]
                    .substitute_question ||
                  completedExam.exercises[currentQuestion]
                }
                isAdmin
              />
            ) : (
              <QuestionCard
                onAnswerChange={() => {}}
                question={completedExam.exercises[currentQuestion]}
                wasSwapped={false}
              />
            )}

            {/* Navigation */}
            <div className={`flex ${userInfoQuery?.user.role === ROLES.ADMIN ? "justify-between" : "justify-end"} items-center flex-1 w-full flex-wrap gap-3 mt-6`}>
              {userInfoQuery?.user.role === ROLES.ADMIN && (
                <Button
                  variant="outline"
                  onClick={() =>
                    setShowCurrentRightAnswer((currentState) => !currentState)
                  }
                  className="whitespace-pre-wrap shrink-1"
                >
                  <Milestone className="w-4 h-4" />
                  {showCurrentRightAnswer ? "Esconder " : "Mostrar "}
                  resposta certa
                </Button>
              )}

              <div className="flex gap-3 items-center flex-wrap">
                <Button
                  variant="outline"
                  onClick={previousQuestion}
                  disabled={currentQuestion === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </Button>

                {currentQuestion === completedExam.exercises.length - 1 ? (
                  <Button
                    onClick={() => redirect("/exams")}
                    variant="secondary"
                    className="shrink-1"
                  >
                    Voltar para listagem de exames
                    <ArrowUpRight />
                  </Button>
                ) : (
                  <Button onClick={nextQuestion}>
                    Próxima
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Question Navigator */}
          <div className="grow md:grow-0 md:max-w-80 w-full">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">
                  Navegação / Informações
                </CardTitle>

                {userInfoQuery?.user.role !== ROLES.ADMIN && (
                  <div className="flex text-sm">
                    <span>
                      Assertividade de:{" "}
                      {progressPercentage ? Math.round(progressPercentage) : 0}%
                      ({rightAnsweredQuestions.length}/
                      {completedExam.exercises.length})
                    </span>
                  </div>
                )}
                {/* <Progress value={progressPercentage} /> */}
              </CardHeader>
              <CardContent>
                <div className="flex items-center flex-wrap gap-2">
                  {completedExam.exercises.map((question, index) => {
                    const isCorrect = question.user_answer === question.answer;
                    const isCurrent = index === currentQuestion;
                    // const isAnswered = true;

                    return (
                      <Button
                        key={question.id}
                        variant={"outline"}
                        size="sm"
                        className={`relative grow min-w-10 ${
                          isCorrect
                            ? "border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                            : "border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                        } 
                          ${
                            isCurrent && isCorrect
                              ? "bg-green-600 text-white hover:bg-green-500 hover:text-white"
                              : isCurrent &&
                                !isCorrect &&
                                "bg-red-600 text-white hover:bg-red-500 hover:text-white"
                          }
                        `}
                        onClick={() => goToQuestion(index)}
                      >
                        {index + 1}
                        {isCorrect ? (
                          <CheckCircle2
                            className={cn(
                              `w-3 h-3 absolute -top-1 -right-1 bg-green-600 rounded-2xl text-white`
                            )}
                          />
                        ) : (
                          <CircleX
                            className={cn(
                              `w-3 h-3 absolute -top-1 -right-1 bg-red-600 rounded-2xl text-white`
                            )}
                          />
                        )}
                      </Button>
                    );
                  })}
                </div>

                {userInfoQuery?.user.role !== ROLES.ADMIN && (
                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      {/* <CheckCircle2 className={cn(`w-3 h-3`)} /> */}
                      <CheckCircle2
                        className={cn(
                          `w-3 h-3 bg-green-600 rounded-2xl text-white`
                        )}
                      />
                      <span>Resposta certa</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* <div className="w-3 h-3 border border-muted-foreground rounded-sm"></div> */}
                      <CircleX
                        className={cn(
                          `w-3 h-3 bg-red-600 rounded-2xl text-white`
                        )}
                      />
                      <span>Resposta errada</span>
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter>
                {userInfoQuery?.user.role !== ROLES.ADMIN ? (
                  <div className="flex flex-col">
                    <span>Nota final: {completedExam.score || 0}</span>
                    <span>Valor da prova: {completedExam.grade || 0}</span>
                  </div>
                ) : (
                  <div className="flex flex-col flex-1 gap-2 w-full">
                    <Button
                      className="max-w-full flex-1 whitespace-pre-wrap"
                      onClick={() => {
                        toast.warning("Você tem certeza?", {
                          description:
                            "Você realmente deseja tornar a revisão possível antes do período?",
                          action: {
                            label: "Sim!",
                            onClick: () => updateReviewVisibilityExam(),
                          },
                        });
                      }}
                      disabled={updatingExam || reviewAllowed}
                    >
                      {
                        reviewAllowed ? "Prova liberada para revisão." : updatingExam
                        ? "Liberando revisão..."
                        : "Liberar prova para revisão agora"}
                    </Button>
                    <small className="opacity-70 leading-3.5">
                      Caso libere agora, a revisão ficará disponível
                      definitivamente!
                    </small>
                  </div>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}
