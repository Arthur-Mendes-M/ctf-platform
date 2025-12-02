"use client";

import type React from "react";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/utils/api/user";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import CTFLogo from "@/components/ctf-logo";
import { cn } from "@/lib/utils";
import { useResult } from "@/hooks/use-result";
import { MailCheck, Send } from "lucide-react";

export default function ForgotPassword() {
  const { ResultComponent, setResult } = useResult();
  const [attempts, setAttempts] = useState(0);
  const [isSent, setIsSent] = useState(false);

  const { mutate: sendEmail, isPending: sendingEmail } = useMutation({
    mutationKey: ["user", "forgot-password"],
    mutationFn: async (formEvent: FormData) => {
      const resetResponse = await resetPassword(formEvent);
      setResult(resetResponse);
      return resetResponse;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);

        setAttempts((old) => old++);
        setIsSent(true);

        setTimeout(() => {
          setIsSent(false);
        }, 10 * 1000);
      } else {
        toast.info("Algo deu errado :(", { description: data.message });
      }
    },
    onError: (error) => {
      toast.info("Algo deu errado :(", { description: error.message });
    },
  });

  return (
    <div className="min-h-svh flex flex-col gap-4 p-6 md:p-10">
      <div className="flex justify-center gap-2 md:justify-start">
        <Link href="/" className="flex items-center gap-2 font-medium">
          <CTFLogo variant="long" />
        </Link>
      </div>

      <div className="grow flex items-center justify-center">
        <div
          className={cn(
            " flex flex-col gap-6 items-center justify-center max-w-sm"
          )}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              sendEmail(formData);
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2">
                <h1 className="text-2xl font-bold">Recuperação de senha</h1>
                <div className="text-center text-sm">
                  Insira seu email e receba um link de acesso temporário
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    name="email"
                  />
                </div>

                {ResultComponent}
                <Button
                  type="submit"
                  className="w-full flex gap-2 items-center justify-center"
                  disabled={isSent || sendingEmail}
                >
                  {/* Ícone dinâmico */}
                  {sendingEmail ? (
                    <Send className="animate-pulse" />
                  ) : isSent ? (
                    <MailCheck />
                  ) : (
                    <Send />
                  )}

                  {/* Texto dinâmico */}
                  <span>
                    {sendingEmail
                      ? "Enviando e-mail..."
                      : isSent
                      ? "E-mail enviado!"
                      : attempts > 0
                      ? "Reenviar e-mail"
                      : "Receber e-mail"}
                  </span>
                </Button>
              </div>
            </div>
          </form>
          {/* <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            Clicando em continuar você esta aceitando{" "}
            <a href="#">nossos termos de serviço</a> e <a href="#">políticas de privacidade</a>.
          </div> */}
        </div>
      </div>
    </div>
  );
}
