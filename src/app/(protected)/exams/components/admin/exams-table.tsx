"use client";

import {
  ClipboardX,
  SearchX,
  Trash2,
  Edit,
  Eye,
  EyeClosed,
  LoaderCircle,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";
import { getAllExams } from "@/utils/api/exam";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ExamsLoading from "../../loading";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ExamType } from "@/utils/types/exam";
import { formatDate } from "@/utils/datetime";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateExamVisibility, deleteExam } from "@/utils/api/admin";
import { redirect, RedirectType } from "next/navigation";
import { updateUserSession } from "@/utils/cookies";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ExamsTable() {
  const queryClient = useQueryClient();
  const [isRedirectingForEditing, setIsRedirectingForEditing] = useState(false);
  const [isRedirectingForReviewing, setIsRedirectingForReviewing] = useState(false);
  const [examWillRedirecting, setExamWillRedirecting] =
    useState<ExamType | null>(null);

  const { isPending, isError, data } = useQuery({
    queryKey: ["exams"],
    queryFn: getAllExams,
  });

  const visibilityMutation = useMutation({
    mutationKey: ["exams", "visibility"],
    mutationFn: async (exam: ExamType) => {
      return await updateExamVisibility(exam.id!);
    },
    onSuccess: (apiResponse, passedExam) => {
      toast.dismiss("updating-exam-visibility");
      if (apiResponse.success) {
        toast.success("Visibilidade alterada com sucesso!");

        queryClient.setQueryData(["exams"], (oldData: ExamType[]) => {
          const cleanExams = oldData.map((exam) =>
            exam.id == passedExam.id ? { ...exam, hidden: !exam.hidden } : exam
          );

          return cleanExams;
        });
      } else {
        toast.error("Algo deu errado! Favor tente novamente.", {
          description: apiResponse.message,
        });
      }
    },
    onError(error) {
      toast.error("Algo deu errado! Favor tente novamente.", {
        description: error.message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationKey: ["exams", "delete"],
    mutationFn: async (exam: ExamType) => {
      return await deleteExam(exam.id!);
    },
    onSuccess: (apiResponse, passedExam) => {
      toast.dismiss("delete-exam");
      if (apiResponse.success) {
        toast.success("Exame excluído com sucesso!");
        queryClient.setQueryData(["exams"], (oldData: ExamType[]) => {
          const cleanExams = oldData.filter(
            (exam) => exam.id !== passedExam.id
          );
          return cleanExams;
        });
      } else {
        toast.error("Algo deu errado! Favor tente novamente.", {
          description: apiResponse.message,
        });
      }
    },
    onError(error) {
      toast.error("Algo deu errado! Favor tente novamente.", {
        description: error.message,
      });
    },
  });

  useEffect(() => {
    if (isPending) {
      toast.info("Aguarde. Carregando exames...", { id: "loading" });
    } else {
      toast.dismiss("loading");
    }
  }, [isPending]);

  if (isPending) {
    return <ExamsLoading />;
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <ClipboardX className="h-12 w-12 mx-auto mb-4" />
        <p>Ops!, Ocorreu um erro inesperado.</p>
        <p className="text-sm">
          Nossa equipe está resolvendo. Tente novamente mais tarde.
        </p>
      </div>
    );
  }

  if (!data || data?.length === 0) {
    return (
      <div className="text-center py-8">
        <SearchX className="h-12 w-12 mx-auto mb-4" />
        <p>Nenhum exame criado ainda</p>
        <p className="text-sm">Crie um novo exame no botão acima!</p>
      </div>
    );
  }

  const toggleExamVisibility = (exam: ExamType) => {
    toast.info(
      `Atualizando a visibilidade do Exame [${exam.title}] para: ${
        exam.hidden ? "visível" : "não visível"
      }`,
      { id: "update-exam-visibility" }
    );

    visibilityMutation.mutate(exam);
  };

  const handleDelete = (exam: ExamType) => {
    toast.warning("ATENÇÃO!", {
      description: `Você está tentando deletar o exame: ${exam.title}`,
      action: {
        label: "Confirmar deleção!",
        onClick() {
          deleteMutation.mutate(exam);
        },
      },
    });
  };

  const handleEdit = async (exam: ExamType) => {
    setIsRedirectingForEditing(true);
    setExamWillRedirecting(exam);
    await updateUserSession({ current_exam: exam });
    redirect(`/exam/${exam.id}/edit`, RedirectType.push);
  };

  const handleReview = async (exam: ExamType) => {
    setIsRedirectingForReviewing(true);
    setExamWillRedirecting(exam);
    await updateUserSession({ current_exam: exam });
    redirect(`/exam/${exam.id}/review`, RedirectType.push);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Exame</TableHead>
            <TableHead className="font-semibold">Começa</TableHead>
            <TableHead className="font-semibold">Termina</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Peso</TableHead>
            <TableHead className="font-semibold">Visível?</TableHead>
            <TableHead className="font-semibold text-center">Ação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((exam: ExamType) => {
            const now = new Date();
            const start = new Date(exam.starts_at);
            const end = new Date(exam.ends_at);

            let status = "";
            if (now < start) {
              status = "Em breve";
            } else if (now >= start && now < end) {
              status = "Em andamento";
            } else if (now >= end) {
              status = "Concluída";
            }

            return (
              <TableRow key={exam.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{exam.title}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">
                      {formatDate(exam.starts_at)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">
                      {formatDate(exam.ends_at)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{status}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{exam.grade}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    value={exam.hidden == false ? "Sim" : "Não"}
                    onValueChange={() => toggleExamVisibility(exam)}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sim">
                        <Eye className="h-4 w-4 text-ctf-green" />
                        Sim
                      </SelectItem>
                      <SelectItem value="Não">
                        <EyeClosed className="h-4 w-4 text-ctf-red" />
                        Não
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReview(exam)}
                          className="h-8 w-8 p-0"
                          disabled={isRedirectingForReviewing}
                        >
                          {isRedirectingForReviewing &&
                          examWillRedirecting &&
                          examWillRedirecting.id === exam.id ? (
                            <LoaderCircle className="h-4 w-4 text-ctf-blue animate-spin" />
                          ) : (
                            <Eye className="h-4 w-4 text-ctf-green" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Revisar exame</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(exam)}
                          className="h-8 w-8 p-0"
                          disabled={isRedirectingForEditing}
                        >
                          {isRedirectingForEditing &&
                          examWillRedirecting &&
                          examWillRedirecting.id === exam.id ? (
                            <LoaderCircle className="h-4 w-4 text-ctf-blue animate-spin" />
                          ) : (
                            <Edit className="h-4 w-4 text-ctf-blue" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Editar exame</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(exam)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4 text-ctf-red" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Excluir exame</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        // onClick={() => getChallengesReportSheetMutation.mutate(challenge.id)}
                        onClick={() => window.open(`/api/excel/${exam.id}?entity=exam`, "_blank")}
                        className="h-8 w-8 p-0"
                      >
                        <FileSpreadsheet className="h-4 w-4 text-ctf-green" />
                      </Button>
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Baixar relatório (.xlsx)</p>
                    </TooltipContent>
                  </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
