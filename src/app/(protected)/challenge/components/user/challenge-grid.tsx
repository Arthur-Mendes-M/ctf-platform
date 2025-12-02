"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Clock,
  Star,
  Gem,
  ShieldQuestion,
  ShieldAlert,
  Swords,
  Flag,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllChallenges } from "@/utils/api/challenge";
import { getDifficultyBadge } from "../challenge-styles";
import { toast } from "sonner";
import ChallengeCard from "./challenge-card";
import { ChallengeType } from "@/utils/types/challenge";
import { getOwnedItems } from "@/utils/api/store";
import { getChallengesAvailableInventory, InventoryList } from "@/utils/types/store";
import ChallengeLoading from "../../loading";

export function ChallengesGrid() {
  const { data: inventory } = useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<InventoryList> =>
      await getOwnedItems().then((data) => {
        return data.data;
      }),
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const { isPending, isError, data } = useQuery({
    queryKey: ["challenges"],
    queryFn: getAllChallenges,
  });

  useEffect(() => {
    if (isPending) {
      toast.info("Aguarde. Carregando desafios...", { id: "loading" });
    } else {
      toast.dismiss("loading");
    }
  }, [isPending]);

  if (isError) {
    return (
      <Card
        className={`relative overflow-hidden cursor-pointer transition-all hover:shadow-lg max-w-lg`}
      >
        <div className={`absolute top-0 left-0 right-0 h-1 bg-red-500`} />

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg bg-opacity-25 bg-red-500`}>
                <ShieldAlert className={`h-6 w-6 text-white`} />
              </div>
              <Badge variant="outline">Erro bonito</Badge>
            </div>
            {getDifficultyBadge("Erro :(")}
          </div>
          <CardTitle className={`text-lg `}>Algo errado :(</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className={`text-sm leading-relaxed text-muted-foreground`}>
            Ocorreu um erro, mas fique tranquilo(a)! Já está sendo resolvido.
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                XP Reward
              </span>
              <span className={`font-bold text-yellow-600`}>
                Nenhum XP ainda
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <Gem className="h-4 w-4 text-red-500" />
                Recompensa
              </span>
              <Badge className="bg-red-500 hover:bg-red-600">
                💎 Nenhum Ruby também
              </Badge>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-blue-500" />
                Prazo
              </span>
              {/* <span className="font-medium">{challenge.timeLimit}</span> */}
              <span className="font-medium">Entre 5 e 10 minutos</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isPending) {
    return (
      <ChallengeLoading />
    );
  }

  if (!data) {
    toast.error("Algo deu errado. Favor tente novamente mais tarde.");

    return (
      <Card
        className={`relative overflow-hidden cursor-pointer transition-all hover:shadow-lg opacity-50`}
      >
        {/* <div className={`absolute top-0 left-0 right-0 h-1 ${challenge.color}`} /> */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-blue-400`} />

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg bg-opacity-25 bg-blue-400`}>
                <ShieldQuestion className={`h-6 w-6 text-white`} />
              </div>
              <Badge variant="outline">Categoria: desconhecida</Badge>
            </div>
            {getDifficultyBadge("Muito difícil")}
          </div>
          <CardTitle className={`text-lg `}>
            Nenhum desafio encontrado no momento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className={`text-sm leading-relaxed text-muted-foreground`}>
            Aguarde o administrador liberar desafios para você!
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                XP Reward
              </span>
              <span className={`font-bold text-yellow-600`}>1.000.000 XP</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <Gem className="h-4 w-4 text-red-500" />
                Recompensa
              </span>
              <Badge className="bg-red-500 hover:bg-red-600">
                💎 1.000.000 Ruby&apos;s
              </Badge>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-blue-500" />
                Prazo
              </span>
              {/* <span className="font-medium">{challenge.timeLimit}</span> */}
              <span className="font-medium">Indeterminado</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length == 0) {
    toast.info("Ainda não existem desafios liberados.");

    return (
      <div className="text-center py-8">
        <Swords className="h-12 w-12 mx-auto mb-4" />
        <p>Nenhum desafio liberado ainda</p>
        <p className="text-sm">
          Aguarde o ADM liberar desafios para você fazer!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 p-4 pb-8 border rounded-2xl">
        <div>
          <h2 className="text-xl font-semibold text-ctf-blue flex gap-3 items-center">
            <Flag /> Desafios em andamento
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          {data
            .filter(
              (challenge: ChallengeType) =>
                !challenge.solved &&
                challenge.attempts !== challenge.max_attempts
            )
            .map((challenge: ChallengeType) => {
              const availableProducts = getChallengesAvailableInventory(challenge, inventory) || [];

              return (
                <ChallengeCard
                  availableProducts={availableProducts}
                  key={challenge.id}
                  challenge={challenge}
                />
              );
            })}
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4 pb-8 border rounded-2xl">
        <div>
          <h2 className="text-xl font-semibold text-ctf-green flex gap-3 items-center">
            <ShieldCheck /> Desafios resolvidos com sucesso
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          {data
            .filter((challenge: ChallengeType) => challenge.solved)
            .map((challenge: ChallengeType) => {
              const availableProducts = getChallengesAvailableInventory(challenge, inventory) || [];

              return (
                <ChallengeCard
                  availableProducts={availableProducts}
                  key={challenge.id}
                  challenge={challenge}
                />
              );
            })}
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4 pb-8 border rounded-2xl">
        <div>
          <h2 className="text-xl font-semibold text-ctf-red flex gap-3 items-center">
            <ShieldX /> Desafios fracassados
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          {data
            .filter(
              (challenge: ChallengeType) =>
                !challenge.solved &&
                challenge.attempts === challenge.max_attempts
            )
            .map((challenge: ChallengeType) => {
              const availableProducts = getChallengesAvailableInventory(challenge, inventory) || [];
              return (
                <ChallengeCard
                  availableProducts={availableProducts}
                  key={challenge.id}
                  challenge={challenge}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}
