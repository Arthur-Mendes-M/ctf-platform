"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Archive,
  Frown,
  ArchiveX,
} from "lucide-react";
import { redirect, useParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { finishExam, getFullExam } from "@/utils/api/exam";
import { ExamType } from "@/utils/types/exam";
import { cn } from "@/lib/utils";
import Loading from "./loading";
import ExamNotFound from "../not-found-exam";
import { toast } from "sonner";
import { updateUserSession } from "@/utils/cookies";
import { ExamHeader } from "../components/exam-header";
import { QuestionCard } from "../components/exam-question-card";
import { FinishExamDialog } from "../components/finish-exam-dialog";
import ProductsSideCard from "../components/products-side-card";
import { ProductActions, ProductActionsStyles } from "@/utils/types/store";

export default function StartedExam() {
  const { exam_id } = useParams<{ exam_id: string }>();
  const { data: completedExam, isLoading } = useQuery<ExamType>({
    queryKey: ["completed-exam", exam_id],
    queryFn: async () => await getFullExam(exam_id),
    enabled: !!exam_id,
    // staleTime: Infinity,
    // refetchOnMount: true
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [usedProductsAreVisible, setUsedProductsAreVisible] = useState(false);

  const { mutate: submitExam } = useMutation({
    mutationKey: ["exams"],
    mutationFn: async () => {
      const mappedAnswers = Object.keys(answers).map((answerId) => ({
        exercise_id: answerId,
        answer: answers[answerId],
      }));

      return await finishExam({ answers: mappedAnswers }, exam_id);
    },
    onSuccess: async (apiResponse) => {
      if (apiResponse.success) {
        toast.success(apiResponse.message, {
          description: "Seus prêmios foram atualizados!",
        });

        await updateUserSession({
          user: {
            xp: apiResponse.data.exam_result.user.xp,
            ruby: apiResponse.data.exam_result.user.ruby,
          },
        });

        localStorage.removeItem(`exam-${exam_id}-answers`);

        setTimeout(() => {
          redirect(`/exams?exam_open=${exam_id}`);
        }, 2 * 1000);
      } else {
        toast.error(apiResponse.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    const saved = localStorage.getItem(`exam-${exam_id}-answers`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.expiresAt && new Date() < new Date(parsed.expiresAt)) {
          setAnswers(parsed.answers || {});
        } else {
          localStorage.removeItem(`exam-${exam_id}-answers`);
        }
      } catch {
        localStorage.removeItem(`exam-${exam_id}-answers`);
      }
    }
  }, [exam_id]);

  useEffect(() => {
    if (!completedExam?.ends_at) return;
    const data = {
      answers,
      expiresAt: completedExam.ends_at,
    };

    localStorage.setItem(`exam-${exam_id}-answers`, JSON.stringify(data));
  }, [answers, exam_id, completedExam?.ends_at]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const nextQuestion = () => {
    if (!completedExam) return;
    if (currentQuestionIndex < completedExam.exercises.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  useEffect(() => {
    setUsedProductsAreVisible(false);
  }, [currentQuestionIndex]);

  const answeredQuestions = Object.keys(answers).length;
  const progressPercentage =
    completedExam && (answeredQuestions / completedExam.exercises.length) * 100;

  if (isLoading) {
    return <Loading />;
  }

  if (!completedExam) {
    return <ExamNotFound />;
  }

  if (completedExam) {
    const currentQuestion = completedExam.exercises[currentQuestionIndex];
    const currentQuestionUsedProducts = currentQuestion.used_products
      ? currentQuestion.used_products
      : [];

    return (
      <div className="min-h-screen">
        {/* Header */}
        <ExamHeader
          exam={completedExam}
          onFinish={() => setShowFinishDialog(true)}
        />

        {/* Main Content */}
        <div className="flex gap-6 p-6 flex-wrap max-w-7xl mx-auto">
          {/* Question Panel */}
          <div className="flex-1 min-w-1/2">
            <div className="mb-6">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <h2 className="text-lg font-semibold">
                  Questão {currentQuestionIndex + 1} de{" "}
                  {completedExam.exercises.length}
                </h2>

                {currentQuestionUsedProducts.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setUsedProductsAreVisible((old) => !old);
                    }}
                  >
                    {usedProductsAreVisible ? (
                      <>
                        <ArchiveX className="w-4 h-4" />
                        Fechar visualização
                      </>
                    ) : (
                      <>
                        <Archive className="w-4 h-4" />
                        Visualizar produtos usados
                      </>
                    )}
                  </Button>
                )}
              </div>

              <Progress
                value={
                  ((currentQuestionIndex + 1) /
                    completedExam.exercises.length) *
                  100
                }
                className="mb-4"
              />
            </div>

            {currentQuestionUsedProducts.length > 0 &&
              usedProductsAreVisible && (
                <Card className="mb-6 gap-0">
                  <CardHeader className="text-sm">
                    <CardTitle>
                      Produtos já utilizados nessa questão / exame
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="border-none py-2 max-w-7xl overflow-x-auto">
                    <div className="flex gap-4 w-fit">
                      {currentQuestionUsedProducts ? (
                        currentQuestionUsedProducts.map((usedProduct) => {
                          const actionStyle =
                            ProductActionsStyles[usedProduct.action];
                          const ActionIcon = actionStyle.icon;
                          const ActionColor = actionStyle.color;

                          return (
                            <div
                              key={usedProduct.id}
                              className={cn(
                                "flex items-center gap-x-4 gap-y-2 min-w-96 rounded-xl border p-4 shadow-sm grow"
                              )}
                            >
                              <div
                                className={`rounded-md p-2 text-white ${ActionColor}`}
                              >
                                <ActionIcon className="h-5 w-5" />
                              </div>
                              <div className="space-y-1 grow flex items-center gap-x-4 gap-y-2 flex-wrap">
                                <div className="grow flex flex-col items-start">
                                  <h4 className="font-semibold leading-none">
                                    {usedProduct.name}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {/* {usedProduct.description} */}
                                    {[ProductActions.ExamHint].includes(
                                      usedProduct.action
                                    )
                                      ? (usedProduct.response as string)
                                      : usedProduct.description}
                                  </p>
                                </div>

                                <div className="flex flex-col items-center text-sm">
                                  <h4>Utilizado</h4>
                                  <span>{`${usedProduct.quantity} ${
                                    usedProduct.quantity > 1 ? "vezes" : "vez"
                                  }`}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="grow flex flex-col gap-2 items-center justify-center opacity-70">
                          <Frown size={50} className="" />
                          <h3 className="max-w-90 text-center">
                            Você não tem nenhum produto disponível para ser
                            utilizado nesse desafio.
                          </h3>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

            <QuestionCard
              question={completedExam.exercises[currentQuestionIndex]}
              // wasSwapped={completedExam.exercises[currentQuestionIndex].substitute_question && completedExam.exercises[currentQuestionIndex]}
              wasSwapped={
                !!completedExam.exercises[currentQuestionIndex]
                  .substitute_question
              }
              answer={
                answers[
                  completedExam.exercises[currentQuestionIndex]
                    .substitute_question
                    ? completedExam.exercises[currentQuestionIndex]
                        .substitute_question.id!
                    : completedExam.exercises[currentQuestionIndex].id!
                ]
              }
              onAnswerChange={(answer) =>
                handleAnswerChange(
                  completedExam.exercises[currentQuestionIndex]
                    .substitute_question
                    ? completedExam.exercises[currentQuestionIndex]
                        .substitute_question.id!
                    : completedExam.exercises[currentQuestionIndex].id!,
                  answer
                )
              }
            />

            {/* Navigation */}
            <div className="flex justify-end flex-wrap gap-3 mt-6">
              <Button
                variant="outline"
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </Button>

              {currentQuestionIndex === completedExam.exercises.length - 1 ? (
                <Button
                  onClick={() => setShowFinishDialog(true)}
                  variant="secondary"
                >
                  Finalizar Prova
                </Button>
              ) : (
                <Button onClick={nextQuestion}>
                  Próxima
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar - Question Navigator */}
          <div className="grow md:grow-0 md:w-80 flex flex-col gap-4 sticky top-24 h-fit">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Navegação</CardTitle>
                <div className="flex items-center gap-4 text-sm">
                  <span>
                    Progresso:{" "}
                    {progressPercentage ? Math.round(progressPercentage) : 0}%
                  </span>
                  <span>
                    {answeredQuestions}/{completedExam.exercises.length}{" "}
                    respondidas
                  </span>
                </div>
                <Progress value={progressPercentage} />
              </CardHeader>
              <CardContent>
                <div className="flex items-center flex-wrap gap-2">
                  {completedExam.exercises.map((question, index) => {
                    const isAnswered = answers[question.id!] !== undefined;
                    // const isFlagged = flaggedQuestions.has(question.id!);
                    const isCurrent = index === currentQuestionIndex;

                    return (
                      <Button
                        key={question.id}
                        variant={isCurrent ? "default" : "outline"}
                        size="sm"
                        className={`relative grow min-w-10 ${
                          isAnswered ? "" : ""
                        } `}
                        onClick={() => goToQuestion(index)}
                      >
                        {index + 1}
                        {isAnswered && (
                          <CheckCircle2
                            className={cn(
                              `w-3 h-3 absolute -top-1 -right-1 text-success`,
                              isCurrent && "bg-primary rounded-2xl"
                            )}
                          />
                        )}
                      </Button>
                    );
                  })}
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={cn(`w-3 h-3`)} />
                    <span>Respondida</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border border-muted-foreground rounded-sm"></div>
                    <span>Não respondida</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <ProductsSideCard
              exam={completedExam}
              currentExercise={completedExam.exercises[currentQuestionIndex]}
            />
          </div>
        </div>

        <FinishExamDialog
          open={showFinishDialog}
          onOpenChange={setShowFinishDialog}
          onConfirm={submitExam}
          answeredQuestions={answeredQuestions}
          totalQuestions={completedExam.exercises.length}
        />
      </div>
    );
  }
}
