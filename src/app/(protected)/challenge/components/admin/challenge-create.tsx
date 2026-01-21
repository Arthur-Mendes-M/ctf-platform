"use client";

import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Globe, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { createChallenge } from "@/utils/api/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  challengeCategories,
  ChallengeCategories,
  ChallengeCategoriesStyles,
  ChallengeType,
  defaultEmptyChallenge,
} from "@/utils/types/challenge";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import SubmitButton from "@/components/submit-button";

export default function CreateChallengeForms() {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<
    ChallengeType | typeof defaultEmptyChallenge
  >(defaultEmptyChallenge);

  const mutation = useMutation({
    mutationKey: ["challenges"],
    mutationFn: async () => {
      if (formData) {
        return await createChallenge(formData);
      }
    },
    onSuccess(data) {
      if (data.success) {
        setFormData(defaultEmptyChallenge);

        toast.dismiss("create-challenge");
        toast.success("Cadastrado com sucesso!");

        queryClient.setQueryData(["challenges"], (oldData: ChallengeType[]) => [
          data.data,
          ...oldData || [],
        ]);
      } else {
        toast.error("Algo deu errado! Favor tente novamente.", {
          description: data.message,
        });
      }
    },
    onError(error) {
      toast.error("Algo deu errado! Favor tente novamente.", {
        description: error.message,
      });
    },
  });

  const handleInputChange = (
    field: keyof ChallengeType,
    value: string | number
  ) => {
    if (!formData) return;
    setFormData({ ...formData, [field]: value });
  };

  const [isDynamicChallenge, setIsDynamicChallenge] = useState(false);

  const handleCreateChallenge = async (event: FormEvent) => {
    event.preventDefault();
    toast.info("Aguarde. Criando o desafio...", { id: "create-challenge" });

    mutation.mutate();

    event.currentTarget.querySelector("input")?.focus();
  };

  return (
    <div className=" flex flex-col gap-6">
      <form onSubmit={handleCreateChallenge} className="grid gap-6 py-4">
        <div className="flex flex-col gap-4">
          <div className="space-y-3">
            <Label htmlFor="challenge-title">
              Título do Desafio <span className="text-red-600">*</span>
            </Label>
            <Input
              id="challenge-title"
              name="title"
              placeholder="Ex: SQL Injection Avançado"
              required
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
            />
          </div>

          <div className="flex items-end justify-between gap-2">
            <div className="flex flex-col gap-2 justify-between">
              <Label htmlFor="challenge-category">
                Categoria <span className="text-red-600">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value: ChallengeCategories) =>
                  handleInputChange("category", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {challengeCategories.map((category) => {
                    const style = ChallengeCategoriesStyles[category];
                    const Icon = style?.icon || Globe;
                    return (
                      <SelectItem key={category} value={category}>
                        <div className="flex items-center gap-2">
                          <div
                            className={`p-1 rounded ${
                              style?.color || "bg-gray-500"
                            }`}
                          >
                            <Icon className="h-3 w-3 text-white" />
                          </div>
                          {category}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 flex flex-col gap-2 justify-between">
              <Label htmlFor="max-attempts">
                Tentativas por usuário <span className="text-red-600">*</span>
              </Label>
              <Input
                id="max-attempts"
                name="max_attempts"
                type="number"
                placeholder="3"
                min="1"
                max="999"
                step={1}
                required
                value={formData.max_attempts}
                onInput={(e) => {
                  if (e.currentTarget.value.length > 3) {
                    e.currentTarget.value = e.currentTarget.value.slice(0, 3);
                  }
                }}
                onChange={(e) => 
                  handleInputChange(
                    "max_attempts",
                    parseInt(e.target.value, 10)
                  )
                }
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="challenge-description">
            Descrição <span className="text-red-600">*</span>
          </Label>
          <Textarea
            id="challenge-description"
            className="resize-none h-20"
            name="description"
            spellCheck
            placeholder="Descrição detalhada do desafio..."
            rows={4}
            required
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
          />
        </div>

        {/* Dica para a flag e descrição da resposta */}
        <div className="grid gap-2">
          <Label htmlFor="flag_description" className="text-sm font-medium">
            Descrição da flag <span className="text-red-600">*</span>
          </Label>
          <Textarea
            id="flag_description"
            className="resize-none h-20"
            spellCheck
            value={formData.flag_description}
            onChange={(e) =>
              handleInputChange("flag_description", e.target.value)
            }
            placeholder="Descrição rápida da flag/comandos usados para chegar nela."
            rows={4}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="flag_tip" className="text-sm font-medium">
            Dica para a flag <span className="text-red-600">*</span>
          </Label>
          <Textarea
            id="flag_tip"
            className="resize-none h-20"
            spellCheck
            value={formData.flag_tip}
            onChange={(e) => handleInputChange("flag_tip", e.target.value)}
            placeholder="Dica rápida sobre como descobrir a flag ou sobre a flag em si."
            rows={4}
          />
        </div>

        <div className="flex gap-2 flex-col my-3">
          <h2>Modelo do desafio</h2>

          <div className="flex gap-3 flex-wrap justify-between">
            <div className="flex gap-2 items-center">
              <Label htmlFor="challenge_type" className="text-sm font-medium">
                O desafio é dinâmico?
              </Label>
              <Switch
                id="challenge_type"
                checked={isDynamicChallenge}
                onCheckedChange={(checked) => setIsDynamicChallenge(checked)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-3">
          <div className="space-y-3">
            <Label htmlFor="challenge-xp">
              XP <span className="text-red-600">*</span>
            </Label>
            <Input
              id="challenge-xp"
              name="xp"
              type="number"
              placeholder="150"
              min="1"
              max="9999999"
              required
              value={formData.xp}
              onInput={(e) => {
                if (e.currentTarget.value.length > 3) {
                  e.currentTarget.value = e.currentTarget.value.slice(0, 7);
                }
              }}
              onChange={(e) =>
                handleInputChange("xp", parseInt(e.target.value, 10))
              }
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="challenge-ruby">
              Ruby <span className="text-red-600">*</span>
            </Label>
            <Input
              id="challenge-ruby"
              name="ruby"
              type="number"
              placeholder="25"
              min="1"
              max="9999999"
              required
              value={formData.ruby}
              onInput={(e) => {
                if (e.currentTarget.value.length > 3) {
                  e.currentTarget.value = e.currentTarget.value.slice(0, 7);
                }
              }}
              onChange={(e) =>
                handleInputChange("ruby", parseInt(e.target.value, 10))
              }
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="challenge-difficulty">
              Dificuldade <span className="text-red-600">*</span>
            </Label>
            <Select
              value={formData.difficulty}
              onValueChange={(value) => handleInputChange("difficulty", value)}
              name="difficulty"
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fácil">Fácil</SelectItem>
                <SelectItem value="Médio">Médio</SelectItem>
                <SelectItem value="Difícil">Difícil</SelectItem>
                <SelectItem value="Muito difícil">Muito Difícil</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isDynamicChallenge && (
          <div className="flex flex-col gap-3">
            <div className="flex justify-between gap-10">
              <div className="space-y-3">
                <Label htmlFor="xp-decay">
                  Queda de XP por acerto <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="xp-decay"
                  name="xp_decay"
                  type="number"
                  placeholder="25"
                  min={0}
                  max={formData.xp}
                  step={1}
                  required
                  value={formData.xp_decay ?? 0}
                  onInput={(e) => {
                    if (e.currentTarget.value.length > 3) {
                      e.currentTarget.value = e.currentTarget.value.slice(0, 7);
                    }
                  }}
                  onChange={(e) =>
                    handleInputChange("xp_decay", parseInt(e.target.value, 10))
                  }
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="ruby-decay">
                  Queda de Ruby por acerto{" "}
                  <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="ruby-decay"
                  name="ruby_decay"
                  type="number"
                  placeholder="25"
                  min={0}
                  max={formData.ruby}
                  step={1}
                  required
                  value={formData.ruby_decay ?? 0}
                  onInput={(e) => {
                    if (e.currentTarget.value.length > 3) {
                      e.currentTarget.value = e.currentTarget.value.slice(0, 7);
                    }
                  }}
                  onChange={(e) =>
                    handleInputChange("ruby_decay", parseInt(e.target.value, 10))
                  }
                />
              </div>
            </div>

            <span className="text-sm">
              Obs: Para saber quantos alunos poderão ganhar os prêmios, divida o
              total de <strong className="text-blue-600">ruby/decay</strong> e <strong className="text-blue-600">xp/decay</strong>.
            </span>
          </div>
        )}

        <div className="space-y-3">
          <Label htmlFor="challenge-flag">
            Flag <span className="text-red-600">*</span>
          </Label>
          <Input
            id="challenge-flag"
            name="flag"
            placeholder="Cole a flag aqui"
            required
            value={formData.flag}
            onChange={(e) => handleInputChange("flag", e.target.value)}
            className="font-mono"
          />
        </div>

        <SubmitButton>
          <Plus className="h-4 w-4 mr-2" />
          Criar Desafio
        </SubmitButton>
      </form>
    </div>
  );
}
