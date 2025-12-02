"use server";

import { getUserSession } from "@/utils/cookies";
import { ROLES } from "@/utils/types/user";
import { Button } from "@/components/ui/button";
import { ClipboardList } from "lucide-react";
import ExamsTable from "./components/admin/exams-table";
import ExamsGrid from "./components/user/exams-grid";
import Link from "next/link";

export default async function Page() {
  const sessionContext = await getUserSession();

  return (
    <>
      <div className="flex justify-between items-center gap-3 w-full flex-wrap">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex gap-3 items-center">
            <ClipboardList className="w-8 h-8" />
            {sessionContext.user.role === ROLES.ADMIN ? "Gerenciar Exames" : "Exames"}
          </h1>
          <p>
            {sessionContext.user.role === ROLES.ADMIN
              ? "Visualização dos exames disponíveis."
              : "Hora de colocar a prova seus conhecimentos."}
          </p>
        </div>

        {sessionContext.user.role === ROLES.ADMIN && (
          <Link href="/exam/create">
            <Button variant="outline" className="bg-blue-600 text-white">
              <ClipboardList className="w-4 h-4" />
              Criar exame
            </Button>
          </Link>
        )}
      </div>

      {sessionContext.user.role === ROLES.ADMIN ? <ExamsTable /> : <ExamsGrid />}
    </>
  );
}
