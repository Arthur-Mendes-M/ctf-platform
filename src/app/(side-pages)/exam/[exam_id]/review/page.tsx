"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ArrowUpRight,
  CircleX,
} from "lucide-react";
import { ExamHeader } from "../components/exam-header";
import { redirect, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getFullExam } from "@/utils/api/exam";
import { ExamType } from "@/utils/types/exam";
import { cn } from "@/lib/utils";
import Loading from "./loading";
import ExamNotFound from "../not-found-exam";
import { SolvedQuestionCard } from "../components/solved-exam-question-card";

export default function ReviewExam() {
  const { exam_id } = useParams<{ exam_id: string }>();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  // const [answers, setAnswers] = useState<Record<string, string>>({});

  const { data: completedExam, isLoading } = useQuery<ExamType>({
    queryKey: ["completed-exam"],
    queryFn: async () => await getFullExam(exam_id),
    // enabled: !!exam_id,
    // staleTime: Infinity,

  });

  // const handleAnswerChange = (questionId: string, answer: string) => {
  //   setAnswers((prev) => ({
  //     ...prev,
  //     [questionId]: answer,
  //   }));
  // };

  const goToQuestion = (index: number) => {
    setCurrentQuestion(index);
  };

  const nextQuestion = () => {
    if (!completedExam) return;
    if (currentQuestion < completedExam.exercises.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const rightAnsweredQuestions = completedExam?.exercises.filter(exercise => exercise.answer === exercise.user_answer) || [];
  const progressPercentage =
    completedExam && (rightAnsweredQuestions.length / completedExam.exercises.length) * 100;

  if (isLoading) {
    return <Loading />;
  }

  if (!completedExam) {
    return <ExamNotFound />;
  }

  if (completedExam) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        {/* Header */}
        <ExamHeader exam={completedExam} onFinish={() => {}} />

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
                progressIndicatorClassName={`rounded-xl ${completedExam.exercises[currentQuestion].answer === completedExam.exercises[currentQuestion].user_answer ? "bg-green-600" : "bg-red-600"}`}
              />
            </div>

            <SolvedQuestionCard
              question={completedExam.exercises[currentQuestion].substitute_question || completedExam.exercises[currentQuestion]}
            />

            {/* Navigation */}
            <div className="flex justify-end flex-wrap gap-3 mt-6">
              <Button
                variant="outline"
                onClick={previousQuestion}
                disabled={currentQuestion === 0}
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </Button>

              {currentQuestion === completedExam.exercises.length - 1 ? (
                <Button onClick={() => redirect("/exams")} variant="secondary">
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

          {/* Sidebar - Question Navigator */}
          <div className="grow md:grow-0 md:w-80">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Navegação / Informações</CardTitle>
                <div className="flex text-sm">
                  <span>
                    Assertividade de:{" "}
                    {progressPercentage ? Math.round(progressPercentage) : 0}% ({rightAnsweredQuestions.length}/{completedExam.exercises.length})
                  </span>
                </div>
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
                            isCurrent && isCorrect ?
                            "bg-green-600 text-white hover:bg-green-500 hover:text-white"  :
                            isCurrent && !isCorrect && "bg-red-600 text-white hover:bg-red-500 hover:text-white"
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
              </CardContent>

              <CardFooter>
              <div className="flex flex-col">
                  <span>
                    Nota final:{" "}
                    {completedExam.score || 0}
                  </span>
                  <span>
                    Valor da prova:{" "}
                    {completedExam.grade || 0}
                  </span>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}
