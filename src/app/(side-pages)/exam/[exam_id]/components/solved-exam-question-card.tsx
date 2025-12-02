import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ExerciseType } from "@/utils/types/exam";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2,
  CircleX,
  CircleXIcon,
  Lightbulb,
  PartyPopper,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductActions } from "@/utils/types/store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SolvedQuestionCardProps {
  question: ExerciseType;
}

export function SolvedQuestionCard({ question }: SolvedQuestionCardProps) {
  const renderQuestionContent = () => {
    const correctAnswer = question.answer;
    const userAnswer = question.user_answer;

    console.log("Correct Answer:", correctAnswer);
    console.log("User Answer:", userAnswer);
    console.log("Question Data:", question);

    switch (question.exercise_type) {
      case "alternativa":
        return (
          <RadioGroup value={question.user_answer || ""}>
            <div className="space-y-3">
              {question.alternatives?.map((option, index) => {
                const otherQuestion =
                  option.value !== userAnswer && option.value !== correctAnswer;

                const answerIsCurrentOption = correctAnswer === option.value;
                const correctAnswerIsUserAnswer = correctAnswer === userAnswer;
                const userAnswerIsCurrentOption = userAnswer === option.value;

                return (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center relative space-x-2",
                      answerIsCurrentOption &&
                        "border-2 border-green-600 text-green-600 px-2 rounded-md",
                      !correctAnswerIsUserAnswer &&
                        userAnswerIsCurrentOption &&
                        "border-2 border-red-600 px-2 rounded-md text-red-600",
                      question.removed_alternatives &&
                        question.removed_alternatives
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
                          question.removed_alternatives &&
                          question.removed_alternatives
                            .map((option) => option.value)
                            .includes(option.value)
                        } // checked={false}
                        className={cn(
                          question.removed_alternatives &&
                            question.removed_alternatives
                              .map((option) => option.value)
                              .includes(option.value) &&
                            "pointer-events-none opacity-60"
                        )}
                      />
                    </div>
                    <Label
                      htmlFor={`option-${index}`}
                      className="text-sm flex-1 p-2 rounded opacity-80 pointer-events-none"
                    >
                      {/* {String.fromCharCode(65 + index)}) {option} */}
                      {option.value}
                    </Label>

                    {(correctAnswer || userAnswer) && answerIsCurrentOption ? (
                      <CheckCircle2
                        className={cn(
                          `w-4 h-4 absolute -top-1 -right-1 bg-green-600 rounded-2xl text-white`
                        )}
                      />
                    ) : (
                      !otherQuestion && (
                        <CircleX
                          className={cn(
                            `w-4 h-4 absolute -top-1 -right-1 bg-red-600 rounded-2xl text-white`
                          )}
                        />
                      )
                    )}
                  </div>
                );
              })}
            </div>
          </RadioGroup>
        );

      case "flag":
        return (
          <>
            <div className="space-y-3">
              <div className="flex gap-2 flex-wrap">
                <div className="flex-1">
                  <Input
                    id="flag-input"
                    placeholder="Cole sua flag aqui"
                    value={question.user_answer || ""}
                    minLength={1}
                    disabled
                  />
                </div>
              </div>
              {correctAnswer !== userAnswer && (
                <div className="text-xs text-green-600">
                  A resposta correta era: {correctAnswer}
                </div>
              )}
            </div>
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
            {getTypeLabel(question.exercise_type)}
          </Badge>

          <div className="flex items-center flex-wrap gap-3">
            {question.used_products &&
              question.used_products.find(
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
                          {question.used_products.map((used) => {
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
            <Badge variant="secondary" className="text-xs">
              {question.exercise_value}{" "}
              {question.exercise_value === 1 ? "ponto" : "pontos"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-lg font-medium leading-relaxed">
          {question.question}
        </div>

        <div className="space-y-4">{renderQuestionContent()}</div>

        {question.answer === question.user_answer ? (
          <div className="p-3 rounded-lg border border-green-500/20 text-green-500/80">
            <div className="text-sm flex gap-2 items-center flex-wrap text-success-foreground font-medium">
              <PartyPopper />
              Você respondeu corretamente
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-lg border border-red-500/20 text-red-500/80">
            <div className="text-sm flex gap-2 items-center flex-wrap text-success-foreground font-medium">
              <CircleXIcon />
              Essa você errou
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
