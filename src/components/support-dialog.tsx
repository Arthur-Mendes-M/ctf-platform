import React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { HeadphonesIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { createTicket } from "@/utils/api/user";

export default function SupportDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const { mutate: handleCreateTicket, isPending: isOpeningTicket } =
    useMutation({
      mutationFn: async (e: React.FormEvent) => {
        e.preventDefault();

        if (!subject.trim() || !description.trim()) {
          toast.error("Por favor, preencha todos os campos.");
          return;
        }

        const formData = new FormData();
        formData.append("subject", subject);
        formData.append("description", description);

        const res = await createTicket(formData);

        if (res.success) {
          toast.success("Chamado criado com sucesso!", {
            description:
              "Sua solicitação foi enviada e será analisada em breve.",
          });

          setSubject("");
          setDescription("");
          onOpenChange(false);
        } else {
          toast.error(res.message);
        }
      },
    });

  const handleClose = () => {
    if (!isOpeningTicket) {
      setSubject("");
      setDescription("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-lg sm:rounded-xl px-4 py-6 max-h-[90vh] overflow-y-auto md:overflow-y-clip overflow-x-hidden">
        <div className="w-full overflow-x-hidden px-2">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <HeadphonesIcon className="h-5 w-5 text-blue-600" />
              Suporte do sistema
            </DialogTitle>
            <DialogDescription>
              Descreva o problema ou bug encontrado na plataforma
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateTicket} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Assunto *</Label>
              <Input
                id="subject"
                type="text"
                placeholder="Ex: Problema com login, Dúvida sobre funcionalidade..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={isOpeningTicket}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                placeholder="Descreva detalhadamente o problema ou bug..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isOpeningTicket}
                className="w-full min-h-[120px] resize-none"
                rows={5}
              />
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isOpeningTicket}
                className="grow-1 bg-transparent"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="grow-3"
                disabled={isOpeningTicket}
              >
                {isOpeningTicket ? "Abrindo chamado" : "Abrir chamado"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
