"use server";

import { ChallengesGrid } from "@/app/(protected)/challenge/components/user/challenge-grid";
import { getUserSession } from "@/utils/cookies";
import { ROLES } from "@/utils/types/user";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import ChallengesTable from "./components/admin/challenge-table";
import CreateChallengeForms from "@/app/(protected)/challenge/components/admin/challenge-create";
import { Swords } from "lucide-react";

export default async function Challenges() {
  const sessionContext = await getUserSession();

  return (
    <>
      <div className="flex justify-between items-center gap-3 w-full flex-wrap">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex gap-3 items-center">
            <Swords className="w-8 h-8"/>
            {sessionContext.user.role === ROLES.ADMIN
              ? "Gerenciar Desafios"
              : "Desafios CTF"}
          </h1>
          <p>
            {sessionContext.user.role === ROLES.ADMIN
              ? "Gerencie todos os desafios, seus status, informações e crie novos."
              : "Teste suas habilidades em segurança cibernética"}
          </p>
        </div>

        {sessionContext.user.role === ROLES.ADMIN && (
          <Sheet>
            <form>
              <SheetTrigger asChild>
                <Button variant="outline" className="bg-blue-600 text-white">
                  <Swords className="w-4 h-4" />
                  Criar desafio
                </Button>
              </SheetTrigger>

              <SheetContent
                aria-describedby={undefined}
                className="overflow-auto flex flex-col p-4 w-full"
              >
                <SheetHeader className="p-0">
                  <SheetTitle className="font-semibold text-2xl flex gap-3 items-center flex-wrap">
                    <Swords className="" />
                    Crie um novo desafio!
                  </SheetTitle>
                </SheetHeader>

                <CreateChallengeForms />
              </SheetContent>
            </form>
          </Sheet>
        )}
      </div>

      {sessionContext.user.role === ROLES.ADMIN ? <ChallengesTable /> : <ChallengesGrid />}

      {/* <iframe src="http://192.168.18.14:7681" className="min-h-screen"></iframe> */}
    </>
  );
}
