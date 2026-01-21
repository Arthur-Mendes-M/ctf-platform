"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllChallenges } from "@/utils/api/challenge";
import {
  ChallengeCategoriesStyles,
  ChallengeType,
} from "@/utils/types/challenge";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Edit,
  Eye,
  EyeClosed,
  FileSpreadsheet,
  Gem,
  ShieldQuestion,
  Swords,
  Trash2,
  Zap,
} from "lucide-react";
import { getDifficultyBadge } from "../challenge-styles";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import ChallengeEditDialog from "./challenge-edit";
import { Badge } from "@/components/ui/badge";
import {
  deleteChallenge,
  updateChallenge,
  updateChallengeVisibility,
} from "@/utils/api/admin";
import { clearUnmodifiedObjectKeys } from "@/utils/objects";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
// import { openExcelInNewTab } from "@/utils/sheets";

export default function ChallengesTable() {
  const queryClient = useQueryClient();

  const { isPending, isError, data } = useQuery<
    unknown,
    Error,
    ChallengeType[],
    string[]
  >({
    queryKey: ["challenges"],
    queryFn: getAllChallenges,
  });

  const [editingChallenge, setEditingChallenge] =
    useState<ChallengeType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const visibilityMutation = useMutation({
    mutationKey: ["challenges", "visibility"],
    mutationFn: async (challenge: ChallengeType) => {
      return await updateChallengeVisibility(challenge.id);
    },
    onSuccess(apiResponse, passedChallenge) {
      toast.dismiss("update-challenge-visibility");

      if (apiResponse.success) {
        toast.success("Visibilidade alterada com sucesso!");

        queryClient.setQueryData(["challenges"], (oldData: ChallengeType[]) => {
          const cleanChallenges = oldData.map((challenge) =>
            challenge.id == passedChallenge.id
              ? { ...challenge, hidden: !challenge.hidden }
              : challenge
          );

          return cleanChallenges;
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

  const updateMutation = useMutation({
    mutationKey: ["challenges", "data"],
    mutationFn: async (challenge: ChallengeType) => {
      if(editingChallenge) {
        return await updateChallenge(clearUnmodifiedObjectKeys(editingChallenge!, challenge)!, editingChallenge.id);
      }
    },
    onSuccess(apiResponse, passedChallenge) {
      toast.dismiss("update-challenge");
      if (apiResponse.success) {
        toast.success("Informações alteradas com sucesso!");
        queryClient.setQueryData(["challenges"], (oldData: ChallengeType[]) => {
          const cleanChallenges = oldData.map((challenge) =>
            challenge.id == passedChallenge.id ? passedChallenge : challenge
          );

          return cleanChallenges;
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
    mutationKey: ["challenges", "delete"],
    mutationFn: async (challenge: ChallengeType) => {
      return await deleteChallenge(challenge.id);
    },
    onSuccess(apiResponse, passedChallenge) {
      toast.dismiss("delete-challenge");
      if (apiResponse.success) {
        toast.success("Desafio deletado com sucesso!");
        queryClient.setQueryData(["challenges"], (oldData: ChallengeType[]) => {
          const cleanChallenges = oldData.filter(
            (challenge) => challenge.id !== passedChallenge.id
          );

          return cleanChallenges;
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

  const handleSaveChallenge = (updatedChallenge: ChallengeType) => {
    toast.info(
      `Atualizando as informações do desafio [${updatedChallenge.title}]...`,
      { id: "update-challenge" }
    );

    updateMutation.mutate(updatedChallenge);
  };

  const toggleChallengeVisibility = (challenge: ChallengeType) => {
    toast.info(
      `Atualizando a visibilidade do desafio [${challenge.title}] para: ${
        challenge.hidden ? "visível" : "não visível"
      }`,
      { id: "update-challenge-visibility" }
    );

    visibilityMutation.mutate(challenge);
  };

  const handleEdit = (challenge: ChallengeType) => {
    setEditingChallenge(challenge);
    setDialogOpen(true);
  };

  const handleDelete = (challenge: ChallengeType) => {
    toast.warning("ATENÇÃO!", {
      description: `Você está tentando deletar o desafio: ${challenge.title}`,
      action: {
        label: "Confirmar deleção!",
        onClick() {
          deleteMutation.mutate(challenge);
        },
      },
    });
  };

  useEffect(() => {
    if (isPending) {
      toast.info("Aguarde. Carregando desafios...", { id: "loading" });
    } else {
      toast.dismiss("loading");
    }
  }, [isPending]);

  if (isPending) {
    return (
      <Table>
        <TableCaption>Carregando desafios...</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Dificuldade</TableHead>
            <TableHead>Valor atual</TableHead>
            <TableHead>Ativo</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: 3 }).map((_, index) => (
            <TableRow key={index} className="animate-pulse">
              <TableCell>
                <div className="h-4 w-24 bg-gray-300 rounded" />
              </TableCell>
              <TableCell>
                <div className="h-4 w-20 bg-gray-300 rounded" />
              </TableCell>
              <TableCell>
                <div className="h-4 w-28 bg-gray-300 rounded" />
              </TableCell>
              <TableCell>
                <div className="h-4 w-16 bg-gray-300 rounded" />
              </TableCell>
              <TableCell>
                <div className="h-4 w-10 bg-gray-300 rounded" />
              </TableCell>
              <TableCell className="text-right">
                <div className="h-4 w-12 bg-gray-300 rounded ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (isError) {
    toast.error("Não foi possível realizar a listagem.");

    return (
      <Table>
        <TableCaption>
          Ocorreu algum erro durante a listagem. Favor, tente novamente mais
          tarde.
        </TableCaption>
      </Table>
    );
  }

  if (!data || data?.length == 0) {
    return (
      <div className="text-center py-8">
        <Swords className="h-12 w-12 mx-auto mb-4" />
        <p>Nenhum desafio criado ainda</p>
        <p className="text-sm">Crie um novo desafio no botão acima!</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Desafio</TableHead>
            <TableHead className="font-semibold">Categoria</TableHead>
            <TableHead className="font-semibold">Dificuldade</TableHead>
            <TableHead className="font-semibold w-24">Ruby</TableHead>
            <TableHead className="font-semibold w-24">XP</TableHead>
            <TableHead className="font-semibold w-32">Visível?</TableHead>
            <TableHead className="font-semibold w-32 text-center">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((challenge: ChallengeType) => {
            const categoryStyle =
              ChallengeCategoriesStyles[
                challenge.category as keyof typeof ChallengeCategoriesStyles
              ];
            const IconComponent = categoryStyle?.icon || ShieldQuestion;

            return (
              <TableRow key={challenge.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        categoryStyle?.color || "bg-muted-foreground"
                      }`}
                    >
                      <IconComponent className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium">
                      {challenge.title}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <span>{challenge.category}</span>
                </TableCell>

                <TableCell>
                  {challenge.difficulty &&
                    getDifficultyBadge(challenge.difficulty)}
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className="text-ctf-red"
                  >
                    <Gem className="h-3 w-3 mr-1" />
                    {challenge.ruby.toLocaleString() || 0}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className="text-ctf-blue"
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    {challenge.xp.toLocaleString() || 0} XP
                  </Badge>
                </TableCell>

                <TableCell>
                  <Select
                    value={challenge.hidden == false ? "Sim" : "Não"}
                    onValueChange={() => toggleChallengeVisibility(challenge)}
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
                        onClick={() => handleEdit(challenge)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4 text-ctf-blue" />
                      </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Editar desafio</p>
                      </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(challenge)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4 text-ctf-red" />
                      </Button>
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Excluir desafio</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        // onClick={() => getChallengesReportSheetMutation.mutate(challenge.id)}
                        onClick={() => window.open(`/api/excel/${challenge.id}?entity=challenge`, "_blank")}
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

      <ChallengeEditDialog
        challenge={editingChallenge}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveChallenge}
      />
    </div>
  );
}
