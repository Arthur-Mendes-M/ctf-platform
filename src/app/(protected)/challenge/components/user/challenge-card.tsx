"use client";

import {
  ChallengeCategoriesStyles,
  ChallengeType,
} from "@/utils/types/challenge";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BookmarkCheck,
  CircleHelp,
  Clock,
  Frown,
  Gem,
  Send,
  ShieldQuestion,
  ShieldX,
  Terminal,
  Zap,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteTerminal,
  increaseTerminalTimer,
  initializeTerminal,
  submitFlag,
  toUseChallengeProduct,
} from "@/utils/api/challenge";
import { toast } from "sonner";
import { updateUserSession } from "@/utils/cookies";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDifficultyBadge } from "../challenge-styles";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import TerminalWindow from "./challenge-terminal";
import { DateTime } from "luxon";
import {
  ProductActions,
  ProductActionsStyles,
  ProductType,
  // ProductType,
} from "@/utils/types/store";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function ChallengeCard({
  challenge,
  availableProducts,
}: {
  challenge: ChallengeType;
  availableProducts: ProductType[];
}) {
  const queryClient = useQueryClient();
  const [confirmingProduct, setConfirmingProduct] = useState<ProductType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] =
    useState<ChallengeType | null>(null);
  const [flagInput, setFlagInput] = useState("");
  const [selectedChallengeTerminalLink, setSelectedChallengeTerminalLink] =
    useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [currentTerminalContainerId, setCurrentTerminalContainerId] = useState<
    string | null
  >(null);
  const availableInventoryRef = useRef<HTMLButtonElement>(null);
  // const [usedProductResponse, setUsedProductResponse] = useState<{
  //   usedProduct: ProductType;
  //   usedProductIcon: LucideIcon;
  //   usedProductColor: string;
  //   message: string;
  // } | null>(null);

  const { mutate: submitFlagMutation } = useMutation({
    mutationKey: ["challenges", "submit-flag"],
    mutationFn: async () => {
      return await submitFlag(selectedChallenge!.id, flagInput.trim());
    },
    onSuccess: async (data) => {
      toast.dismiss("flag-submission");

      if (data && data.success) {
        toast.success("Você acertou!! ", {
          description: `A flag está correta e seus prêmios já foram atualizados!\nRuby's atais: \n${data.data.user.ruby}\nXP atual: ${data.data.user.xp}`,
        });

        await updateUserSession({
          user: {
            xp: data.data.user.xp,
            ruby: data.data.user.ruby,
          }
        });
      } else {
        toast.warning("Infelizmente você não acertou :(", {
          description: data.message,
        });
      }

      const updatedChallenge: ChallengeType = {
        ...selectedChallenge!,
        flag: data.success ? flagInput : "",
        solved: data.success,
        attempts: selectedChallenge!.attempts + 1,
      };

      setSelectedChallenge((prev) => {
        return { ...prev!, attempts: prev!.attempts + 1 };
      });

      if (data?.data?.challenge?.flag_description) {
        updatedChallenge.flag_description =
          data?.data?.challenge?.flag_description;
      }

      queryClient.setQueryData(["challenges"], (oldData: ChallengeType[]) => {
        const updatedChallenges = oldData.map((oldChallenge) => {
          if (oldChallenge.id === updatedChallenge.id) {
            return updatedChallenge;
          }
          return oldChallenge;
        });

        return updatedChallenges;
      });
    },
    onError: (error) => {
      toast.dismiss("flag-submission");

      toast.error("Ocorreu algum erro durante a submissão da flag :(", {
        description: error.message,
      });
    },
  });

  const { mutate: toUseChallengeProductMutation, isPending: usingProduct } = useMutation(
    {
      mutationKey: ["challenges"],
      mutationFn: async ({ product }: { product: ProductType }) => {
        const flag = flagInput.trim();

        if (
          product.action === ProductActions.MultiplyChallengeXp &&
          (!flag || flag.length <= 0)
        ) {
          toast.warning("Antes, insira a flag!", {
            description:
              "Para utilizar o produto, insira a flag e clique nesse produto sem enviar a flag!",
          });

          return;
        } else if (
          product.action === ProductActions.MultiplyChallengeXp &&
          flag &&
          flag.length > 0
        ) {
          handleSubmitFlag(challenge);

          return;
        }

        return toUseChallengeProduct({ challenge, product });
      },
      onSuccess: (response, { product: successUsedProduct }) => {
        if (!response) return;

        if (response.success) {
          toast.success(response.message);

          availableInventoryRef.current!.click();

          queryClient.setQueryData(
            ["challenges"],
            (oldChallenges: ChallengeType[]) => {
              const updatedOlderChallenges = oldChallenges.map(
                (oldChallenge) => {
                  if (oldChallenge.id === challenge.id) {
                    // successUsedProduct.action === ProductActions.BuyChallengeAttempt
                    return {
                      ...oldChallenge,
                      attempts:
                        successUsedProduct.action ===
                        ProductActions.BuyChallengeAttempt
                          ? oldChallenge.attempts - 1
                          : oldChallenge.attempts,
                      used_products: [
                        ...oldChallenge.used_products,
                        response.data,
                      ],
                    };
                  } else {
                    return oldChallenge;
                  }
                }
              );

              return updatedOlderChallenges;
            }
          );
        } else {
          toast.warning(response.message);
        }
      },
      onError: (error) => {
        toast.error("Ocorreu algum erro durante a submissão da flag :(", {
          description: error.message,
        });
      },
    }
  );

  const handleChallengeClick = (challenge: ChallengeType) => {
    setSelectedChallenge(challenge);
    setFlagInput("");
    setIsDialogOpen(true);
  };

  const linkTerminalMutation = useMutation({
    mutationFn: async () => await initializeTerminal(selectedChallenge!.id),
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

  const deleteTerminalContainerMutation = useMutation({
    mutationFn: async () => await deleteTerminal(currentTerminalContainerId!),
    onSuccess: (data) => {
      if (!data.success) {
        toast.error("Ocorreu um erro ao tentar encerrar a instância!", {
          description: data.message,
        });

        return;
      }

      toast.info(data.message);

      setSelectedChallengeTerminalLink(null);
      setExpiresAt(null);
      setCurrentTerminalContainerId(null);
    },
    onError: (error) => {
      toast.error("Ocorreu um erro ao tentar encerrar a instância!", {
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

  const handleSubmitFlag = (challenge: ChallengeType) => {
    if (challenge.attempts < challenge.max_attempts) {
      toast.info("Fazendo a submissão da flag...", { id: "flag-submission" });

      submitFlagMutation();
    } else {
      toast.error(
        "Atenção! Você já realizou todas as tentativas para esse desafio."
      );
    }
  };

  const Icon =
    ChallengeCategoriesStyles[challenge?.category]?.icon ?? ShieldQuestion;
  const currentColor =
    ChallengeCategoriesStyles[challenge?.category]?.color ?? "bg-blue-500";

  const completionRate = selectedChallenge
    ? (selectedChallenge.attempts / selectedChallenge.max_attempts) * 100
    : (challenge.attempts / challenge.max_attempts) * 100;

  return (
    <Dialog
      open={isDialogOpen && selectedChallenge?.id === challenge.id}
      onOpenChange={(currentOpen) => {
        if (!currentOpen) {
          setSelectedChallengeTerminalLink(null);
          if (currentTerminalContainerId)
            deleteTerminalContainerMutation.mutate();
        }
        setIsDialogOpen(currentOpen);
      }}
    >
      <DialogTrigger asChild>
        <Card
          className={`relative justify-between overflow-hidden cursor-pointer transition-all hover:shadow-lg`}
          onClick={() => handleChallengeClick(challenge)}
        >
          {/* <div className={`absolute top-0 left-0 right-0 h-1 ${challenge.color}`} /> */}
          <div
            className={`absolute top-0 left-0 right-0 h-1 ${currentColor}`}
          />

          <CardHeader className="pb-3">
            <div className="flex items-start flex-wrap gap-4 justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg bg-opacity-25 ${currentColor}`}>
                  <Icon className={`h-6 w-6 text-white`} />
                </div>
                <Badge variant="outline">{challenge.category}</Badge>
              </div>
              {getDifficultyBadge(challenge.difficulty!)}
            </div>
            <CardTitle className={`text-lg `}>
              {challenge.title || "Desconhecido"}
            </CardTitle>

            <CardDescription
              className={`text-sm leading-relaxed text-muted-foreground`}
            >
              {challenge.description ?? "Nenhuma descrição disponível."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center flex-wrap gap-2 justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-blue-700" />
                  XP Reward
                </span>
                <span className={`font-bold text-blue-700`}>
                  {challenge.xp.toLocaleString()} XP
                </span>
              </div>

              <div className="flex items-center flex-wrap gap-2 justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Gem className="h-4 w-4 text-red-500" />
                  Recompensa
                </span>
                <Badge className="text-red-600 bg-transparent border-red-200">
                  {challenge.ruby.toLocaleString()} Ruby&apos;s
                </Badge>
              </div>

              <div className="flex items-center flex-wrap gap-2 justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-blue-500" />
                  Prazo
                </span>
                <span className="font-medium opacity-60">Indeterminado</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Tentativas</span>
                <span>
                  {challenge.attempts}/{challenge.max_attempts}
                </span>
              </div>
              <Progress
                value={completionRate}
                progressIndicatorClassName={currentColor}
                className={`h-2`}
              />
              <p className="text-xs text-muted-foreground">
                {challenge.attempts.toLocaleString()} tentativa(s) de{" "}
                {challenge.max_attempts.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent
        aria-describedby={undefined}
        className={`flex flex-col gap-3 max-h-[95vh] max-w-4xl overflow-x-hidden border-none  ${
          selectedChallengeTerminalLink &&
          "max-h-none rounded-none min-w-full h-full"
        }`}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={`p-2 rounded-lg bg-opacity-25 ${currentColor}`}>
              <Icon className={`h-6 w-6 text-white`} />
            </div>

            {challenge.title || "Desconhecido"}
          </DialogTitle>
          <DialogDescription className="flex items-center flex-wrap gap-4 mt-2">
            <Badge variant="outline" className={`text-white ${currentColor}`}>
              {challenge.category}
            </Badge>
            {getDifficultyBadge(challenge.difficulty!)}
            <Badge className="text-red-600 bg-transparent border-red-200">
              <Gem />
              {challenge.ruby.toLocaleString()} Ruby&apos;s
            </Badge>
            <Badge variant="outline" className="text-blue-500 border-blue-500">
              {challenge.xp.toLocaleString()} XP
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span className="text-sm font-medium">Tentativas restantes:</span>
            <Badge
              variant={
                challenge.attempts >= challenge.max_attempts
                  ? "destructive"
                  : "secondary"
              }
            >
              {challenge.attempts}/{challenge.max_attempts}
            </Badge>
          </div>

          <div className="fle flex-col gap-5">
            <h2 className="font-medium text-lg mb-2">Instruções do desafio</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {challenge.description}
            </p>
            {!selectedChallengeTerminalLink &&
              !challenge.solved &&
              challenge.attempts != challenge.max_attempts && (
                <Button
                  onClick={() => linkTerminalMutation.mutate()}
                  className={`${currentColor} text-white mt-2 w-full hover:${currentColor}`}
                  disabled={linkTerminalMutation.isPending}
                >
                  <Terminal />

                  {linkTerminalMutation.isPending
                    ? "Iniciando..."
                    : "Criar instância do terminal"}
                </Button>
              )}

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
              />
            )}
          </div>

          {/* <div className="border rounded-lg p-4 overflow-hidden">
            <div className="flex flex-col items-start justify-between">
              {challenge.attempts == challenge.max_attempts ||
              (challenge.attempts !== challenge.max_attempts &&
                challenge.solved) ? (
                <p className="opacity-55">
                  O terminal deste desafio só pode ser aberto em desafios que
                  estão em andamento!
                </p>
              ) : (
                <>
                  <div
                    className={`w-full flex items-center justify-center ${
                      !selectedChallengeTerminalLink && "h-30"
                    }`}
                  >
                    {!selectedChallengeTerminalLink && (
                      <Button
                        onClick={() => linkTerminalMutation.mutate()}
                        className={`${currentColor} text-white`}
                        disabled={linkTerminalMutation.isPending}
                      >
                        <Terminal />

                        {linkTerminalMutation.isPending
                          ? "Iniciando..."
                          : "Criar instância"}
                      </Button>
                    )}
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
                      increaseTimer={() =>
                        increaseTerminalTimerMutation.mutate()
                      }
                    />
                  )}
                </>
              )}
            </div>
          </div> */}

          {challenge.used_products && challenge.used_products.length > 0 && (
            <div>
              <div className="overflow-y-hidden overflow-x-auto">
                <ul className="flex gap-3 w-fit py-3 pr-8">
                  {challenge.used_products.map(
                    (usedProduct, usedProductIdx) => {
                      const actionStyle =
                        ProductActionsStyles[usedProduct.action];
                      const UsedProductIcon = actionStyle.icon;
                      const UsedProductColor = actionStyle.color;

                      return (
                        <li
                          key={usedProductIdx}
                          className="text-nowrap min-w-max"
                        >
                          <small>Produto utilizado</small>
                          <div className="border rounded-lg p-4 w-full flex items-center gap-2">
                            <Avatar>
                              <AvatarImage src="#" alt="" />
                              <AvatarFallback
                                className={`${UsedProductColor} text-white`}
                              >
                                <UsedProductIcon className="h-5 w-5" />
                              </AvatarFallback>
                            </Avatar>

                            {(!challenge.solved &&
                              challenge.max_attempts === challenge.attempts) ||
                            (challenge.solved &&
                              challenge.max_attempts !== challenge.attempts)
                              ? usedProduct.name
                              : usedProduct.response}
                          </div>
                        </li>
                      );
                    }
                  )}
                </ul>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {challenge.attempts == challenge.max_attempts &&
            !challenge.solved ? (
              <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/30 p-6 shadow-sm">
                <ShieldX className="h-5 w-5 text-red-700 mt-1" />
                <div className="flex flex-col">
                  <p className="text-lg font-medium text-red-700">
                    Você errou esse desafio!
                  </p>
                  <p className="text-sm text-red-600/80 mt-1">
                    Você não possui mais chances.
                  </p>
                </div>
              </div>
            ) : challenge.solved ? (
              <div className="flex flex-col gap-4">
                {/* Bloco verde: mensagem de sucesso + flag */}
                <div className="flex flex-col gap-4 rounded-2xl border border-green-200 bg-green-50/30 p-6 shadow-sm">
                  {/* Mensagem de sucesso */}
                  <div className="flex items-center gap-3 text-green-700">
                    <BookmarkCheck className="h-5 w-5" />
                    <p className="text-lg font-medium">
                      Parabéns! Você resolveu esse desafio.
                    </p>
                  </div>

                  {/* Linha divisória */}
                  <div className="border-t border-green-200" />

                  {/* Resposta certa */}
                  <div>
                    <h3 className="text-sm font-semibold text-green-800 uppercase tracking-wide">
                      Resposta certa
                    </h3>
                    <p className="text-base font-mono text-green-950 bg-green-100 px-2 py-1 rounded mt-1 inline-block">
                      {challenge.flag}
                    </p>
                  </div>
                </div>

                {/* Novo card: descrição da flag */}
                <div className="flex flex-col gap-2 rounded-2xl border border-ctf-blue bg-secondary p-6 shadow-sm">
                  <div className="flex items-center gap-2 text-ctf-blue">
                    <CircleHelp className="h-4 w-4" />
                    <h3 className="text-sm font-semibold">Descrição da flag</h3>
                  </div>
                  <p className="text-sm">
                    {challenge.flag_description ?? (
                      <span className="italic opacity-60">
                        Sem descrição
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <Label htmlFor="flag-input">Submeter Flag</Label>
                <div className="flex gap-2 flex-wrap">
                  <div className="flex-1">
                    <Input
                      id="flag-input"
                      placeholder="Cole sua flag aqui"
                      value={flagInput}
                      required
                      minLength={1}
                      onChange={(e) => setFlagInput(e.target.value)}
                      disabled={challenge.attempts >= challenge.max_attempts}
                    />
                  </div>
                  <Button
                    onClick={() => handleSubmitFlag(challenge)}
                    disabled={
                      !flagInput || challenge.attempts >= challenge.max_attempts
                    }
                    className={`h-full ${currentColor} hover:${currentColor} text-white`}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Enviar
                  </Button>
                </div>
                {challenge.attempts > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Tentativa {challenge.attempts.toLocaleString()} de{" "}
                    {challenge.max_attempts.toLocaleString()} realizada
                  </p>
                )}
              </>
            )}
          </div>

          <Drawer>
            <DrawerTrigger
              ref={availableInventoryRef}
              className={cn(
                "outline-none",
                !availableProducts ||
                  (availableProducts.length <= 0 && "opacity-80")
              )}
              disabled={!availableProducts || availableProducts.length <= 0}
            >
              <div className="flex flex-col items-start gap-3 text-sm">
                <h2>
                  {availableProducts && availableProducts.length > 0
                    ? "Visualizar items disponíveis para esse desafio."
                    : "Você não possui produtos disponíveis para esse desafio."}
                </h2>

                <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 transition-all *:data-[slot=avatar]:ring-2 cursor-pointer w-full">
                  {availableProducts.length > 0 ? (
                    availableProducts.map((product) => {
                      // // const categoryStyle =
                      //   ProductCategoriesStyles[
                      //     product.category as ProductCategories
                      //   ];

                      const actionStyle = ProductActionsStyles[product.action];
                      // const CategoryIcon = categoryStyle.icon;
                      const ActionIcon = actionStyle.icon;
                      const ActionColor = actionStyle.color;

                      return (
                        <Avatar key={product.id}>
                          <AvatarImage src="#" alt="" />
                          <AvatarFallback
                            className={`${ActionColor} text-white`}
                          >
                            <ActionIcon className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                      );
                    })
                  ) : (
                    <div className="grow flex flex-col gap-2 justify-center opacity-70">
                      <Avatar>
                        <AvatarImage src="#" alt="" />
                        <AvatarFallback>
                          <Frown />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                </div>
              </div>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Produtos disponíveis para utilizar</DrawerTitle>
                <DrawerDescription>
                  Baseado no seu inventário e no desafio que você esta
                  realizando, você pode utilizar os produtos abaixo.
                </DrawerDescription>
              </DrawerHeader>

              <div className="flex flex-wrap py-6 px-4 pb-10 gap-4 w-full max-w-6xl mx-auto">
                {availableProducts.length > 0 ? (
                  availableProducts.map((product) => {
                    // const categoryStyle =
                    //   ProductCategoriesStyles[
                    //     product.category as ProductCategories
                    //   ];

                    const actionStyle = ProductActionsStyles[product.action];
                    // const CategoryIcon = categoryStyle.icon;
                    const ActionIcon = actionStyle.icon;
                    const ActionColor = actionStyle.color;

                    return (
                      <div
                        key={product.id}
                        className={cn(
                          "flex items-start gap-4 rounded-xl border p-4 shadow-sm grow hover:shadow-lg transition-all cursor-pointer",
                          usingProduct && "opacity-70 cursor-default"
                        )}
                        onClick={() => setConfirmingProduct(product)}
                      >
                        <div
                          className={`rounded-md p-2 text-white ${ActionColor}`}
                        >
                          <ActionIcon className="h-5 w-5" />
                        </div>
                        <div className="space-y-1 grow flex items-center gap-4 flex-wrap">
                          <div className="grow flex flex-col items-start">
                            <h4 className="font-semibold leading-none">
                              {product.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {product.description}
                            </p>
                          </div>
                          <div>
                            {confirmingProduct && confirmingProduct.id === product.id && (
                              <div className="flex gap-2 w-full justify-end">
                                <Button
                                  size="sm"
                                  variant={"outline"}
                                  type="reset"
                                  onClick={(ev) => {
                                    ev.stopPropagation();
                                    setConfirmingProduct(null);
                                  }}
                                >
                                  Cancelar
                                </Button>

                                <Button
                                  size="sm"
                                  onClick={(ev) => {
                                    ev.stopPropagation();
                                    toUseChallengeProductMutation({ product });
                                    setConfirmingProduct(null);
                                  }}
                                >
                                  Confirmar
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="grow flex flex-col gap-2 items-center justify-center opacity-70">
                    <Frown size={50} className="" />
                    <h3 className="max-w-90 text-center">
                      Você não tem nenhum produto disponível para ser utilizado
                      nesse desafio.
                    </h3>
                  </div>
                )}
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
