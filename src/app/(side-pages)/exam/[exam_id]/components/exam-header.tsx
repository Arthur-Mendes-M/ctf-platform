import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Check, CircleX, Clock, LogOut } from "lucide-react";
import { ExamTimer } from "./exam-timer";
import { ExamType, getExamStatus } from "@/utils/types/exam";
import { differenceInSeconds } from "date-fns";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProductActions, ProductActionsStyles } from "@/utils/types/store";

interface ExamHeaderProps {
  exam: ExamType;
  onFinish?: () => void;
  isAdmin?: boolean
}

export function ExamHeader({ exam, onFinish, isAdmin }: ExamHeaderProps) {
  const timeRemaining = differenceInSeconds(exam.ends_at, new Date());
  return (
    <header className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-50 shadow-sm">
      {/* <div className=""> */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              {exam.title}
            </h1>
            <Badge variant="outline" className="text-xs">
              {getExamStatus(exam) === "Em andamento" ? (
                <>
                  <Clock className="w-3 h-3 mr-1" />
                  Prova em Andamento
                </>
              ) : getExamStatus(exam) === "Não realizado" ? (
                <>
                  <CircleX className="w-3 h-3 mr-1" />
                  Prova não realizada
                </>
              ) : (
                <>
                  <Check className="w-3 h-3 mr-1" />
                  Prova concluída
                </>
              )}
            </Badge>
          </div>
        </div>

        <div className="flex items-center flex-wrap">
          {exam.used_products_exam && exam.used_products_exam.length > 0 && (
            <div className="mr-5">
              {exam.used_products_exam.map((usedProduct) => {
                const actionStyle = ProductActionsStyles[usedProduct.action];
                const ActionIcon = actionStyle.icon;
                const ActionColor = actionStyle.color;

                return (
                  <Avatar
                    key={usedProduct.id}
                    className="relative overflow-visible"
                    title={`Foram adicionados ${exam.used_products_exam?.reduce(
                      (prev, current) => {
                        if (current.action === ProductActions.AddExamTime) {
                          return (prev += current.quantity * 10);
                        }

                        return prev;
                      },
                      0
                    )} minutos`}
                  >
                    <AvatarImage src="#" alt="" />
                    <AvatarFallback className={`${ActionColor} text-white`}>
                      <ActionIcon className="h-5 w-5" />
                    </AvatarFallback>

                    <span
                      className={`absolute -top-1 -right-3 shadow-sm rounded-full w-6 h-3 text-[10px] flex items-center justify-center bg-black text-white`}
                    >
                      x{usedProduct.quantity}
                    </span>
                  </Avatar>
                );
              })}
            </div>
          )}

          <div className="flex items-center gap-4 flex-wrap">
            {getExamStatus(exam) === "Em andamento" && !isAdmin && (
              <ExamTimer timeRemaining={timeRemaining} />
            )}

            {getExamStatus(exam) === "Em andamento" && !isAdmin ? (
              <Button className="bg-ctf-red text-white opacity-75 hover:bg-ctf-red hover:opacity-90" onClick={onFinish}>
                <LogOut className="w-4 h-4" />
                Finalizar
              </Button>
            ) : (
              <Button onClick={() => redirect("/exams")} variant="secondary" className="shrink-1 whitespace-break-spaces">
                Voltar para listagem de exames
                <ArrowUpRight />
              </Button>
            )}
          </div>
        </div>
      </div>
      {/* </div> */}
    </header>
  );
}
