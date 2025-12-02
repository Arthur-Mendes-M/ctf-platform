"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-none border-none bg-transparent">
        <CardContent className="p-8 md:p-12 text-center ">
          <div className="mb-8">
            <Image
              src="/not-found-page-undraw.svg" // Substitua pelo caminho real no seu projeto
              alt="Página não encontrada"
              width={360}
              height={240}
              className="mx-auto mb-6"
            />

            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Página não encontrada
            </h2>

            <p className="text-lg mb-8 max-w-md mx-auto">
              Ops! A página que você está procurando não existe ou foi movida
              para outro local.
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <Button
              asChild
              size="lg"
              variant={"default"}
              className="bg-blue-600"
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Voltar ao início
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
