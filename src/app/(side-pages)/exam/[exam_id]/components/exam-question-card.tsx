import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ExerciseType } from "@/utils/types/exam";
import { Input } from "@/components/ui/input";
import TerminalWindow from "@/app/(protected)/challenge/components/user/challenge-terminal";
import { Button } from "@/components/ui/button";
import { Lightbulb, Terminal } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  increaseTerminalTimer,
  initializeTerminal,
} from "@/utils/api/challenge";
import { toast } from "sonner";
import { DateTime } from "luxon";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SolvedQuestionCard } from "./solved-exam-question-card";
import { ProductActions } from "@/utils/types/store";
import { cn } from "@/lib/utils";
interface QuestionCardProps {
  question: ExerciseType;
  answer?: string;
  wasSwapped: boolean;
  onAnswerChange: (answer: string) => void;
}

export function QuestionCard({
  question,
  answer,
  onAnswerChange,
  wasSwapped,
}: QuestionCardProps) {
  const [selectedChallengeTerminalLink, setSelectedChallengeTerminalLink] =
    useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [currentTerminalContainerId, setCurrentTerminalContainerId] = useState<
    string | null
  >(null);

  const currentQuestion = question.substitute_question || question;

  const linkTerminalMutation = useMutation({
    mutationFn: async () => await initializeTerminal(currentQuestion.id!),
    onSuccess: (data) => {
      if (!data.url) {
        toast.error("Ocorreu um erro ao tentar iniciar a instância!", {
          description: data.message,
        });

        return;
      }

      const endHour = DateTime.fromISO(data.expiresAt, { zone: "utc" })
        .setZone("America/Sao_Paulo")
        .toLocaleString(DateTime.TIME_24_SIMPLE);

      toast.info(data.message, {
        description: `Você tem até as ${endHour} de hoje para encontrar a flag ou adicionar mais tempo!`,
        duration: 10 * 1000,
      });

      setSelectedChallengeTerminalLink(data.url);
      setExpiresAt(data.expiresAt);
      setCurrentTerminalContainerId(data.containerId);
    },
    onError: (error) => {
      toast.error("Ocorreu um erro ao tentar iniciar a instância!", {
        description: error.message,
      });
    },
  });

  const increaseTerminalTimerMutation = useMutation({
    mutationFn: async () =>
      await increaseTerminalTimer(currentTerminalContainerId!),
    onSuccess: (data) => {
      if (data.success) {
        const endHour = DateTime.fromISO(data.expiresAt, { zone: "utc" })
          .setZone("America/Sao_Paulo")
          .toLocaleString(DateTime.TIME_24_SIMPLE);

        toast.info(data.message, {
          description: `Você tem até as ${endHour} de hoje para encontrar a flag ou adicionar mais tempo!`,
        });
        setExpiresAt(data.expiresAt);

        return;
      }

      toast.error("Ocorreu um erro ao tentar adicionar tempo!", {
        description: data.message,
      });
    },
  });

  const renderQuestionContent = () => {
    switch (currentQuestion.exercise_type) {
      case "alternativa":
        return (
          <RadioGroup value={answer || ""} onValueChange={onAnswerChange}>
            <div className="space-y-3">
              {currentQuestion.alternatives?.map((option, index) => {
                return (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center space-x-2",
                      currentQuestion.removed_alternatives &&
                        currentQuestion.removed_alternatives
                          .map((option) => option.value)
                          .includes(option.value) &&
                        "pointer-events-none opacity-60"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span>{option.letter}</span>
                      <RadioGroupItem
                        value={option.value}
                        id={`option-${index}`}
                        disabled={
                          currentQuestion.removed_alternatives &&
                          currentQuestion.removed_alternatives
                            .map((option) => option.value)
                            .includes(option.value)
                        }
                      />
                    </div>
                    <Label
                      htmlFor={`option-${index}`}
                      className="text-sm cursor-pointer flex-1 p-2 rounded hover:bg-muted/50"
                    >
                      {/* {String.fromCharCode(65 + index)}) {option} */}
                      {option.value}
                    </Label>
                  </div>
                );
              })}
            </div>
          </RadioGroup>
        );

      // case "true_false":
      //   return (
      //     <RadioGroup value={answer || ""} onValueChange={onAnswerChange}>
      //       <div className="space-y-3">
      //         <div className="flex items-center space-x-2">
      //           <RadioGroupItem value="true" id="true" />
      //           <Label htmlFor="true" className="text-sm cursor-pointer flex-1 p-2 rounded hover:bg-muted/50">
      //             Verdadeiro
      //           </Label>
      //         </div>
      //         <div className="flex items-center space-x-2">
      //           <RadioGroupItem value="false" id="false" />
      //           <Label htmlFor="false" className="text-sm cursor-pointer flex-1 p-2 rounded hover:bg-muted/50">
      //             Falso
      //           </Label>
      //         </div>
      //       </div>
      //     </RadioGroup>
      //   );

      case "flag":
        return (
          <>
            <div className="space-y-3">
              {/* <Textarea
              value={answer || ""}
              onChange={(e) => onAnswerChange(e.target.value)}
              placeholder="Digite sua resposta aqui..."
              className="min-h-32 resize-none"
            /> */}

              {!selectedChallengeTerminalLink && (
                <Button
                  onClick={() => linkTerminalMutation.mutate()}
                  className={`bg-ctf-blue text-white opacity-85 hover:bg-ctf-blue hover:opacity-90 mt-2 w-full`}
                  disabled={linkTerminalMutation.isPending}
                >
                  <Terminal />

                  {linkTerminalMutation.isPending
                    ? "Iniciando..."
                    : "Criar instância do terminal"}
                </Button>
              )}

              <div className="flex gap-2 flex-wrap">
                <div className="flex-1">
                  <Input
                    id="flag-input"
                    placeholder="Cole sua flag aqui"
                    value={answer || ""}
                    minLength={1}
                    onChange={(e) => onAnswerChange(e.target.value)}
                  />
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Dica: Coloque somente a flag e exatamente o valor. De
                preferência, copie e cole a flag aqui para reduzir risco de
                erros.
              </div>
            </div>

            {selectedChallengeTerminalLink && (
              <TerminalWindow
                terminal_url={selectedChallengeTerminalLink}
                visibility={!!selectedChallengeTerminalLink}
                onClose={() => {
                  setSelectedChallengeTerminalLink(null);
                  // deleteTerminalContainerMutation.mutate()
                }}
                expiresAt={expiresAt!}
                increaseTimer={() => increaseTerminalTimerMutation.mutate()}
                props={{ width: "500px", height: 200 }}
              />
            )}
          </>
        );

      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "multiple_choice":
        return "Múltipla Escolha";
      case "essay":
        return "Dissertativa";
      case "true_false":
        return "Verdadeiro/Falso";
      default:
        return type;
    }
  };

  return (
    <Card className="shadow-card gap-2">
      <CardHeader className="">
        <div className="flex items-center justify-between gap-x-2 gap-y-4 flex-wrap">
          <Badge variant="outline" className="text-xs">
            {getTypeLabel(currentQuestion.exercise_type)}
          </Badge>

          <div className="flex items-center flex-wrap gap-3">
            {currentQuestion.used_products &&
              currentQuestion.used_products.find(
                (used) => used.action === ProductActions.ExamHint
              ) && (
                <Dialog>
                  <DialogTrigger>
                    <Badge
                      variant="outline"
                      className="group flex items-center justify-center hover:gap-1 hover:px-4 cursor-pointer gap-0 px-1 py-0.5 border-yellow-500 text-yellow-500 overflow-hidden transition-all duration-300 "
                    >
                      <Lightbulb className="stroke-3" />
                      <span className="max-w-0 opacity-0 overflow-hidden transition-all duration-300 group-hover:max-w-xs group-hover:opacity-100">
                        Questão com dica
                      </span>
                    </Badge>
                  </DialogTrigger>

                  <DialogContent >
                    <DialogHeader className="font-normal">
                      <DialogTitle className="flex gap-3 flex-col">
                        <span className="flex gap-2 items-center font-normal">
                          <Lightbulb className="text-amber-500" />A dica é:{" "}
                        </span>
                        <code className="px-2 py-4 rounded-md border border-amber-500 font-normal">
                          {currentQuestion.used_products.map((used) => {
                            if (used.action === ProductActions.ExamHint) {
                              return used.response.toString();
                            }
                          })}
                        </code>
                      </DialogTitle>
                      <DialogDescription className="sr-only">
                        Você utilizou um produto de dica para essa questão.
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              )}

            {wasSwapped && (
              <Dialog>
                <DialogTrigger className="cursor-pointer" asChild>
                  <Badge variant={"secondary"} className="text-xs">
                    Questão original
                  </Badge>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Questão original</DialogTitle>
                    <DialogDescription>
                      A questão abaixo se trata da questão que foi substituída
                      através do uso do produto de troca.
                    </DialogDescription>
                  </DialogHeader>
                  <SolvedQuestionCard
                    question={{ ...question, answer: "Questão trocada!" }}
                  />
                </DialogContent>
              </Dialog>
            )}
            <Badge variant="secondary" className="text-xs">
              {currentQuestion.exercise_value}{" "}
              {currentQuestion.exercise_value === 1 ? "ponto" : "pontos"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-lg font-medium leading-relaxed">
          {currentQuestion.question}
        </div>

        <div className="space-y-4">{renderQuestionContent()}</div>

        {answer && (
          <div className="p-3 bg-success-light rounded-lg border border-success/20">
            <div className="text-sm text-success-foreground font-medium">
              ✓ Resposta salva
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
