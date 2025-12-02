"use client"

import { useState, useEffect } from "react"
import { Globe, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { challengeCategories, ChallengeCategories, ChallengeCategoriesStyles, ChallengeType } from "@/utils/types/challenge"
import SubmitButton from "@/components/submit-button"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface ChallengeEditDialogProps {
  challenge: ChallengeType | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (challenge: ChallengeType) => void
}

export default function ChallengeEditDialog({ challenge, open, onOpenChange, onSave }: ChallengeEditDialogProps) {
  const [formData, setFormData] = useState<ChallengeType | null>(null)
  const [isDynamicChallenge, setIsDynamicChallenge] = useState(false);
  const [wasChanged, setWasChanged] = useState(false)

  useEffect(() => {
    if (challenge) {
      setFormData({ ...challenge })
      setIsDynamicChallenge((challenge?.xp_decay && challenge.xp_decay > 0) || (challenge?.ruby_decay && challenge.ruby_decay > 0) ? true : false)
    }
  }, [challenge])


  useEffect(() => {
    const fieldsAreEqual = JSON.stringify(formData) == JSON.stringify(challenge!)

    if (!fieldsAreEqual) {
      setWasChanged(true)
    } else {
      setWasChanged(false)
    }
  }, [formData, challenge])

  const handleInputChange = (field: keyof ChallengeType, value: unknown) => {
    if (!formData) return
    setFormData({ ...formData, [field]: value })
  }

  const handleSave = () => {
    if (!formData) return

    onSave(formData)
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  if (!formData) return null

  const categoryStyle = ChallengeCategoriesStyles[formData.category]
  const IconComponent = categoryStyle?.icon || Globe

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent aria-describedby={undefined} className="overflow-y-auto p-5 w-full">
        <SheetHeader className="p-0">
          <SheetTitle className="flex gap-3 text-xl">
            <div className={`p-2 rounded-lg ${categoryStyle?.color || "bg-gray-500"}`}>
              <IconComponent className="h-5 w-5 text-white" />
            </div>
            Editar Desafio
          </SheetTitle>
        </SheetHeader>

        <div className="grid gap-6 py-4">
          {/* Título */}
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
              <div className="space-y-3 flex flex-col gap-2 justify-between">
                <Label htmlFor="challenge-category">
                  Categoria <span className="text-red-600">*</span>
                </Label>
                <Select
                  value={formData.category}
                  required
                  onValueChange={(value: ChallengeCategories) => handleInputChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {challengeCategories.map((category) => {
                      const style = ChallengeCategoriesStyles[category]
                      const Icon = style?.icon || Globe
                      return (
                        <SelectItem key={category} value={category}>
                          <div className="flex items-center gap-2">
                            <div className={`p-1 rounded ${style?.color || "bg-gray-500"}`}>
                              <Icon className="h-3 w-3 text-white" />
                            </div>
                            {category}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 flex flex-col gap-2 justify-between">
                <Label htmlFor="max-attempts">
                  Tentativas por usuário{" "}
                  <span className="text-red-600">*</span>
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
                  onChange={(e) => handleInputChange("max_attempts", parseInt(e.target.value, 10))}
                />
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Descrição do desafio <span className="text-red-600">*</span>
            </Label>
            <Textarea
              id="description"
              className="resize-none h-20"
              spellCheck
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Descrição detalhada do desafio"
              rows={4}
              required
            />
          </div>

          {/* Dica para a flag e descrição da resposta */}
          <div className="grid gap-2">
            <Label htmlFor="flag_description" className="text-sm font-medium">
              Descrição da flag
            </Label>
            <Textarea
              id="flag_description"
              className="resize-none h-20"
              spellCheck
              value={formData.flag_description}
              onChange={(e) => handleInputChange("flag_description", e.target.value)}
              placeholder="Descrição rápida da flag/comandos usados para chegar nela."
              rows={4}
              required
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
              required
            />
          </div>

          <div className="flex gap-2 flex-col my-3 min-w-full">
            <h2>Modelo | Visibilidade</h2>

            <div className="flex gap-3 flex-wrap justify-between">
              <div className="flex gap-2 items-center f">
                <Label htmlFor="challenge_type" className="text-sm font-medium">
                  O desafio é dinâmico?
                </Label>
                <Switch
                  id="challenge_type"
                  required
                  checked={isDynamicChallenge}
                  onCheckedChange={(checked) => setIsDynamicChallenge(checked)}
                />
              </div>

              <div className="flex gap-2 items-center">
                <Label htmlFor="visibility" className="text-sm font-medium">
                  Deixar visível?
                </Label>
                <Switch
                  id="visibility"
                  checked={!formData.hidden}
                  required
                  onCheckedChange={(checked) => handleInputChange("hidden", !checked)}
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
                onChange={(e) => handleInputChange("xp", parseInt(e.target.value, 10))}
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
                onChange={(e) => handleInputChange("ruby", parseInt(e.target.value, 10))}
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
                  value={formData.xp_decay}
                  onInput={(e) => {
                    if (e.currentTarget.value.length > 3) {
                      e.currentTarget.value = e.currentTarget.value.slice(0, 7);
                    }
                  }}
                  onChange={(e) => handleInputChange("xp_decay", parseInt(e.target.value, 10))}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="ruby-decay">
                  Queda de ruby por acerto <span className="text-red-600">*</span>
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
                  value={formData.ruby_decay}
                  onInput={(e) => {
                    if (e.currentTarget.value.length > 3) {
                      e.currentTarget.value = e.currentTarget.value.slice(0, 7);
                    }
                  }}
                  onChange={(e) => handleInputChange("ruby_decay", parseInt(e.target.value, 10))}
                />
              </div>
            </div>
          )}

          {/* Flag */}
          <div className="grid gap-2">
            <Label htmlFor="flag" className="text-sm font-medium">
              Flag
            </Label>
            <Input
              id="flag"
              value={formData.flag}
              required
              onChange={(e) => handleInputChange("flag", e.target.value)}
              placeholder="42"
              className="font-mono"
            />
          </div>
        </div>

        <SheetFooter className="gap-2">
          <Button variant="ghost" onClick={handleCancel}>
            Cancelar
          </Button>

          <SubmitButton onClick={handleSave} disabled={!wasChanged}>
            <Save className="h-4 w-4 mr-2" />
            Salvar alterações
          </SubmitButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
