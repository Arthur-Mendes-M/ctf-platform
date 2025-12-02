import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

interface FinishExamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  answeredQuestions: number;
  totalQuestions: number;
}

export function FinishExamDialog({
  open,
  onOpenChange,
  onConfirm,
  answeredQuestions,
  totalQuestions
}: FinishExamDialogProps) {
  const unansweredCount = totalQuestions - answeredQuestions;
  const hasUnanswered = unansweredCount > 0;
  const canFinish = !hasUnanswered;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {hasUnanswered ? (
              <AlertTriangle className="w-5 h-5 text-warning" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-success" />
            )}
            Finalizar Prova
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>
                {hasUnanswered
                  ? "Você ainda não respondeu todas as questões. Finalizar só será possível quando todas forem respondidas."
                  : "Tem certeza que deseja finalizar a prova? Esta ação não pode ser desfeita."
                }
              </p>
              
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Resumo da prova:</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Questões respondidas:</span>
                    <span className="font-medium">{answeredQuestions}/{totalQuestions}</span>
                  </div>
                  {hasUnanswered && (
                    <div className="flex justify-between text-warning">
                      <span>Questões não respondidas:</span>
                      <span className="font-medium">{unansweredCount}</span>
                    </div>
                  )}
                </div>
              </div>

              {hasUnanswered && (
                <div className="bg-warning-light p-4 rounded-lg border border-warning/20">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-warning-foreground">Atenção!</p>
                      <p className="text-warning-foreground/80">
                        Responda todas as questões antes de finalizar.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Continuar Prova</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={!canFinish}
            className={`bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Finalizar Prova
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}