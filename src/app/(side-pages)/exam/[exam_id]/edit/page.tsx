"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Copy, ArrowLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  ExamType,
  ExamCategoryType,
  ExamDifficultyType,
  ExerciseType,
  //ExamToCreateType,
} from "@/utils/types/exam";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { updateExam } from "@/utils/api/admin";
import { redirect, useParams } from "next/navigation";
//import { getChangedFields } from "@/utils/objects";
import { validateExamData } from "@/utils/validations";
import { getFullExam } from "@/utils/api/exam";
import ExamNotFound from "../not-found-exam";
import Loading from "../started/loading";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { v4 as uuidv4} from "uuid";

export default function ExamEdit() {
  const { exam_id } = useParams<{ exam_id: string }>();
  const { data: exam, isLoading } = useQuery<ExamType>({
    queryKey: ["completed-exam"],
    queryFn: async () => await getFullExam(exam_id),
    enabled: !!exam_id,
  });

  const [examData, setExamData] = useState<Pick<
    ExamType,
    | "id"
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
  > | null>(exam || null);

  useEffect(() => {
    if (exam) {
      setExamData(exam);
    }
  }, [exam, exam_id]);

  const { mutate: updateExamMutation, isPending: isSubmitting } = useMutation({
    mutationKey: ["exams"],
    mutationFn: updateExam,
    onSuccess: (apiResponse) => {
      if (apiResponse.success) {
        toast.success("Sucesso!", {
          description: "Prova editada com sucesso!",
        });
      } else {
        toast.error(apiResponse.message);
      }
    },
    onError: (error: Error) => {
      toast.error(error.name, { description: error.message });
    },
  });

  const handleUpdateExam = async () => {
    if (!validateExamData(examData!)) return;

    const formattedData = {
      ...examData,
      exercises: examData!.exercises.map((ex, index) => {
        const toSave = {
          ...ex,
          exercise_number: index + 1,
          _id: ex.id,
        };

        delete toSave.id;
        return toSave;
      }),
      substitute_exercises: examData!.substitute_exercises
        ? examData!.substitute_exercises.map((ex, index) => {
            const toSave = {
              ...ex,
              exercise_number: examData!.exercises.length + index + 1,
              _id: ex.id,
            };
            delete toSave.id;

            return toSave;
          })
        : [],
      starts_at: new Date(examData!.starts_at).toISOString(),
      ends_at: new Date(examData!.ends_at).toISOString(),
    };

    delete formattedData.id;

    if (!exam) {
      toast.error("Não foi possível carregar os dados da prova");
      return;
    }

    // TODO: criar outro tipo para aceitar lista de strings
    // const changedFields = getChangedFields<ExamType>(exam, formattedData);

    if (Object.keys(formattedData).length === 0) {
      toast.info("Nenhuma alteração detectada");
      return;
    }

    updateExamMutation({ examId: exam!.id, newExam: formattedData });
  };

  const addExercise = (isSubstitute = false) => {
    const exerciseArray = isSubstitute
      ? examData!.substitute_exercises
      : examData!.exercises;
    const newExercise: ExerciseType = {
      exercise_number: exerciseArray.length + 1,
      exercise_type: "alternativa",
      exercise_tip: ``,
      question: "",
      alternatives: [
        { letter: "", value: "" },
        { letter: "", value: "" },
        { letter: "", value: "" },
      ],
      answer: "",
      exercise_value: 0.0,
    };

    setExamData(
      (prev) =>
        prev && {
          ...prev,
          [isSubstitute ? "substitute_exercises" : "exercises"]: [
            ...exerciseArray,
            newExercise,
          ],
        }
    );
  };

  const removeExercise = (index: number, isSubstitute = false) => {
    const key = isSubstitute ? "substitute_exercises" : "exercises";
    setExamData(
      (prev) =>
        prev && {
          ...prev,
          [key]: prev[key].filter((_, i) => i !== index),
        }
    );
  };

  const updateExercise = (
    index: number,
    field: keyof ExerciseType,
    value: unknown,
    isSubstitute = false
  ) => {
    const key = isSubstitute ? "substitute_exercises" : "exercises";
    setExamData(
      (prev) =>
        prev && {
          ...prev,
          [key]: prev[key].map((exercise, i) =>
            i === index ? { ...exercise, [field]: value } : exercise
          ),
        }
    );
  };

  const updateAlternative = (
    exerciseIndex: number,
    altIndex: number,
    value: string,
    isSubstitute = false
  ) => {
    const key = isSubstitute ? "substitute_exercises" : "exercises";
    setExamData(
      (prev) =>
        prev && {
          ...prev,
          [key]: prev[key].map((exercise, i) =>
            i === exerciseIndex
              ? {
                  ...exercise,
                  alternatives: exercise.alternatives?.map((alt, j) =>
                    j === altIndex ? { value } : alt
                  ),
                }
              : exercise
          ),
        }
    );
  };

  const addAlternative = (exerciseIndex: number, isSubstitute = false) => {
    const key = isSubstitute ? "substitute_exercises" : "exercises";
    setExamData(
      (prev) =>
        prev && {
          ...prev,
          [key]: prev[key].map((exercise, i) =>
            i === exerciseIndex
              ? {
                  ...exercise,
                  alternatives: [
                    ...(exercise.alternatives || []),
                    {
                      letter: String.fromCharCode(
                        65 + ((exercise.alternatives?.length ?? 0) % 26)
                      ),
                      value: "",
                    },
                  ],
                }
              : exercise
          ),
        }
    );
  };

  const removeAlternative = (
    exerciseIndex: number,
    altIndex: number,
    isSubstitute = false
  ) => {
    const key = isSubstitute ? "substitute_exercises" : "exercises";
    setExamData(
      (prev) =>
        prev && {
          ...prev,
          [key]: prev[key].map((exercise, i) =>
            i === exerciseIndex
              ? {
                  ...exercise,
                  alternatives: exercise.alternatives?.filter(
                    (_, j) => j !== altIndex
                  ),
                }
              : exercise
          ),
        }
    );
  };

  const renderExercise = (
    exercise: ExerciseType,
    index: number,
    isSubstitute = false
  ) => (
    <Card key={`${isSubstitute ? "sub" : "main"}-${index}`} className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Exercício {exercise.exercise_number}
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => removeExercise(index, isSubstitute)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label>Tipo do Exercício</Label>
            <Select
              required
              value={exercise.exercise_type}
              onValueChange={(value: "alternativa" | "flag") => {
                updateExercise(index, "exercise_type", value, isSubstitute);
                if (value === "flag") {
                  updateExercise(
                    index,
                    "alternatives",
                    undefined,
                    isSubstitute
                  );
                } else if (!exercise.alternatives) {
                  updateExercise(
                    index,
                    "alternatives",
                    ["", "", ""],
                    isSubstitute
                  );
                }
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alternativa">Alternativa</SelectItem>
                <SelectItem value="flag">Flag</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Valor do Exercício</Label>
            <Input
              required
              min={0}
              type="number"
              step="0.1"
              value={exercise.exercise_value}
              onChange={(e) =>
                updateExercise(
                  index,
                  "exercise_value",
                  Number.parseFloat(e.target.value),
                  isSubstitute
                )
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Dica do Exercício</Label>
          <Input
            placeholder="Coloque uma dica para resolução do exercício"
            value={exercise.exercise_tip}
            onChange={(e) =>
              updateExercise(
                index,
                "exercise_tip",
                e.target.value,
                isSubstitute
              )
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Pergunta</Label>
          <Textarea
            placeholder="Informe a pergunta"
            required
            value={exercise.question}
            onChange={(e) =>
              updateExercise(index, "question", e.target.value, isSubstitute)
            }
            rows={3}
          />
        </div>
        {exercise.exercise_type === "alternativa" && exercise.alternatives && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Alternativas</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addAlternative(index, isSubstitute)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {exercise.alternatives.map((alt, altIndex) => {
              return (
                <div key={altIndex} className="flex gap-2 mb-2">
                  <Input
                    required
                    value={alt.value}
                    onChange={(e) => {
                      updateAlternative(
                        index,
                        altIndex,
                        e.target.value,
                        isSubstitute
                      );
                    }}
                    placeholder={`Alternativa ${altIndex + 1}`}
                  />
                  {exercise.alternatives!.length > 2 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        removeAlternative(index, altIndex, isSubstitute)
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Label>Resposta Correta </Label>

          {exercise.exercise_type === "alternativa" ? (
            <RadioGroup
              value={exercise.answer || ""}
              onValueChange={(e) =>
                updateExercise(index, "answer", e, isSubstitute)
              }
              className="flex flex-col grow gap-3"
            >
              {exercise.alternatives!.map((option, i) => {
                const tempExerciseId = uuidv4();

                return (
                  <div key={i} className="flex items-center grow space-x-2">
                    <RadioGroupItem
                      value={option.value}
                      id={`exercise-${tempExerciseId}-option-${i}`}
                    />
                    <Label
                      htmlFor={`exercise-${tempExerciseId}-option-${i}`}
                      className="text-sm cursor-pointer flex-1 p-2 rounded hover:bg-muted/50"
                    >
                      <span className="mr-2">{option.letter}</span>
                      {option.value || "Vazio"}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          ) : (
            <Input
              placeholder="Informe a resposta correta da pergunta"
              required
              value={exercise.answer}
              onChange={(e) =>
                updateExercise(index, "answer", e.target.value, isSubstitute)
              }
            />
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return <Loading />;
  }

  if (!examData || !exam) {
    return <ExamNotFound />;
  }

  if (examData || exam) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Editar Prova</h1>

          <div className="flex gap-2 items-center flex-wrap">
            <Button
              onClick={() => {
                redirect("/exams");
              }}
              disabled={isSubmitting}
              className="flex items-center gap-2"
              variant={"outline"}
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>

            <Button
              onClick={handleUpdateExam}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Editar prova
            </Button>
          </div>
        </div>

        {/* Informações Básicas da Prova */}
        <Card>
          <CardHeader>
            <CardTitle>Informações da Prova</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Título</Label>
                <Input
                  placeholder="Informe o título da prova"
                  required
                  value={examData.title}
                  onChange={(e) =>
                    setExamData(
                      (prev) => prev && { ...prev, title: e.target.value }
                    )
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Categoria</Label>
                <Select
                  required
                  value={examData.category}
                  onValueChange={(value: ExamCategoryType) =>
                    setExamData((prev) => prev && { ...prev, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OSINT">OSINT</SelectItem>
                    <SelectItem value="Web Security">Web Security</SelectItem>
                    <SelectItem value="Cryptography">Cryptography</SelectItem>
                    <SelectItem value="Forensics">Forensics</SelectItem>
                    <SelectItem value="Binary Exploitation">
                      Binary Exploitation
                    </SelectItem>
                    <SelectItem value="Reverse Engineering">
                      Reverse Engineering
                    </SelectItem>
                    <SelectItem value="Malware Analysis">
                      Malware Analysis
                    </SelectItem>
                    <SelectItem value="Cloud Security">
                      Cloud Security
                    </SelectItem>
                    <SelectItem value="IoT Security">IoT Security</SelectItem>
                    <SelectItem value="Fundamentals">Fundamentals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Descrição</Label>
              <Textarea
                placeholder="Coloque uma breve descrição da prova"
                required
                value={examData.description}
                onChange={(e) =>
                  setExamData(
                    (prev) =>
                      prev && {
                        ...prev,
                        description: e.target.value,
                      }
                  )
                }
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="flex flex-col gap-2">
                <Label>XP</Label>
                <Input
                  required
                  type="number"
                  min={0}
                  value={examData.xp}
                  onChange={(e) =>
                    setExamData(
                      (prev) =>
                        prev && {
                          ...prev,
                          xp: Number.parseInt(e.target.value),
                        }
                    )
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Ruby</Label>
                <Input
                  required
                  type="number"
                  min={0}
                  value={examData.ruby}
                  onChange={(e) =>
                    setExamData(
                      (prev) =>
                        prev && {
                          ...prev,
                          ruby: Number.parseInt(e.target.value),
                        }
                    )
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Nota</Label>
                <Input
                  type="number"
                  step="0.1"
                  min={0}
                  value={examData.exercises.reduce(
                    (acc, ex) => acc + (ex.exercise_value || 0),
                    0
                  )}
                  disabled
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Dificuldade</Label>
                <Select
                  required
                  value={examData.difficulty}
                  onValueChange={(value: ExamDifficultyType) =>
                    setExamData(
                      (prev) => prev && { ...prev, difficulty: value }
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fácil">Fácil</SelectItem>
                    <SelectItem value="Médio">Médio</SelectItem>
                    <SelectItem value="Difícil">Difícil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Data/Hora de Início</Label>
                <Input
                  required
                  type="datetime-local"
                  min={new Date().toISOString().slice(0, 16)}
                  value={
                    examData.starts_at ? examData.starts_at.slice(0, 16) : ""
                  }
                  onChange={(e) =>
                    setExamData(
                      (prev) =>
                        prev && {
                          ...prev,
                          starts_at: e.target.value,
                        }
                    )
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Data/Hora de Fim</Label>
                <Input
                  disabled={examData.starts_at == ""}
                  required
                  type="datetime-local"
                  min={examData.starts_at}
                  value={examData.ends_at ? examData.ends_at.slice(0, 16) : ""}
                  onChange={(e) => {
                    const newEnd = e.target.value;

                    if (new Date(newEnd) <= new Date(examData.starts_at)) {
                      toast.error("Erro de validação", {
                        description:
                          "A data final não pode ser menor do que a inicial.",
                      });
                      return;
                    }
                    setExamData((prev) => prev && { ...prev, ends_at: newEnd });
                  }}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={examData.hidden}
                onCheckedChange={(checked) =>
                  setExamData((prev) => prev && { ...prev, hidden: checked })
                }
              />
              <Label>Prova Oculta</Label>
            </div>
          </CardContent>
        </Card>

        {/* Exercícios Principais */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Exercícios Principais</h2>
            <Button onClick={() => addExercise(false)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Exercício
            </Button>
          </div>
          {examData.exercises.map((exercise, index) =>
            renderExercise(exercise, index, false)
          )}
        </div>

        {/* Exercícios Substitutos */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Exercícios Substitutos</h2>
            <Button onClick={() => addExercise(true)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Exercício Substituto
            </Button>
          </div>
          {!examData.substitute_exercises ||
          examData.substitute_exercises.length <= 0 ? (
            <p>Nenhum exercício substituto por aqui. </p>
          ) : (
            examData.substitute_exercises.map((exercise, index) =>
              renderExercise(exercise, index, true)
            )
          )}
        </div>
      </div>
    );
  }
}
