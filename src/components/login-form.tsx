"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LockKeyholeOpen,
  HatGlasses,
  Key,
  LockKeyhole,
  Fingerprint,
} from "lucide-react";
import { loginUser } from "@/utils/api/user";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { PasswordInput } from "./password-input";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useResult } from "@/hooks/use-result";

// const initialMessageTime = 5 / 1000 // 5 seconds

export default function LoginForm() {
  const { ResultComponent, setResult } = useResult();

  const { mutate: login, isPending: isLoginPending } = useMutation({
    mutationKey: ["user", "login"],
    mutationFn: async (formEvent: FormData) => {
      const loginResponse = await loginUser(formEvent);
      setResult(loginResponse);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault(); // evita reload
        const formData = new FormData(e.currentTarget);
        login(formData);
      }}
      className={cn("flex flex-col gap-6")}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Insper CTF Arena | V2</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Entre com suas credenciais nos campos abaixo.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <HatGlasses
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2"
            />

            <Input
              id="email"
              type="email"
              name="email"
              placeholder="m@example.com"
              required
              autoComplete="email"
              className="pl-8"
              autoFocus
            />
          </div>
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Senha</Label>
            <Link
              href="/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Esqueceu sua senha?
            </Link>
          </div>
          {/* <Input id="password" type="password" required /> */}
          <div className="relative">
            <Key
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2"
            />

            <PasswordInput
              className="pl-8"
              required
              name="password"
              placeholder="********"
            />
          </div>
        </div>

        {ResultComponent}

        <Button
          type="submit"
          className="w-full flex items-center gap-2 group"
          disabled={isLoginPending}
        >
          {isLoginPending ? (
            <>
              <Fingerprint className="animate-pulse" />
              Validando credenciais...
            </>
          ) : (
            <>
              <LockKeyholeOpen className="group-hover:flex hidden" />
              <LockKeyhole className="group-hover:hidden flex" />
              Entrar
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
