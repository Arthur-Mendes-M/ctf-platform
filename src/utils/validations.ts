import { ExamType } from "@/utils/types/exam";
import { toast } from "sonner";

export const validateExamData = (
  examData: Pick<
    ExamType,
    | "title"
    | "description"
    | "category"
    | "difficulty"
    | "hidden"
    | "ruby"
    | "xp"
    | "starts_at"
    | "ends_at"
    | "exercises"
    | "substitute_exercises"
  >
): boolean => {
  if (!examData.title || !examData.description || !examData.category) {
    toast.error("Erro de validação", {
      description:
        "Preencha todos os campos obrigatórios (título, descrição e categoria).",
    });
    return false;
  }

  if (examData.exercises.length === 0) {
    toast.error("Erro de validação", {
      description: "Adicione pelo menos um exercício principal.",
    });
    return false;
  }

  if (
    examData.exercises.reduce((acc, ex) => acc + (ex.exercise_value || 0), 0) >
    100
  ) {
    toast.warning("Nota total da prova é muito grande", {
      description:
        "Revise os valores dos exercícios para que o valor não seja maior que 100.",
    });
    return false;
  }

  const allExercises = [
    ...examData.exercises,
    ...examData.substitute_exercises,
  ];

  for (const ex of allExercises) {
    if (!ex.exercise_type) {
      toast.error("Selecione o tipo do exercício");
      return false;
    }
    if (ex.exercise_value == null || ex.exercise_value < 0) {
      toast.error("Informe um valor válido para o exercício");
      return false;
    }
    if (!ex.exercise_tip?.trim()) {
      toast.error("Informe a dica do exercício");
      return false;
    }
    if (!ex.question?.trim()) {
      toast.error("Informe a pergunta do exercício");
      return false;
    }
    if (!ex.answer?.trim()) {
      toast.error("Informe a resposta correta");
      return false;
    }

    if (ex.exercise_type === "alternativa") {
      if (!ex.alternatives || ex.alternatives.length < 2) {
        toast.error("Adicione pelo menos 2 alternativas");
        return false;
      }
      for (const alt of ex.alternatives) {
        if (!alt.value) {
          toast.error("Preencha todas as alternativas");
          return false;
        }
      }
      const values = ex.alternatives.map((alt) => alt.value.trim());
      const uniqueValues = new Set(values);

      if (uniqueValues.size !== values.length) {
        toast.error("Não pode ter alternativas repetidas");
        return false;
      }
    }
  }
  return true;
};
