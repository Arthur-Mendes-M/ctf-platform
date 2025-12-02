import AdminDashboard from "@/app/(protected)/dashboard/components/admin/admin-dashboard";
import { ROLES } from "@/utils/types/user";
import UserDashboard from "./components/user/user-dashboard";
import { getUserSession } from "@/utils/cookies";
import { ChartPie, ClipboardList, Users, Users2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import CreateUserForms from "./components/admin/create-user";
// import { redirect } from "next/navigation";

export default async function Dashboard() {
  const sessionContext = await getUserSession();

  return (
    <>
      <div className="mb-8 flex justify-between items-center gap-3 w-full flex-wrap">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex gap-3 items-center">
            {sessionContext.user.role === ROLES.ADMIN ? (
              <ClipboardList className="w-8 h-8" />
            ) : (
              <ChartPie className="w-8 h-8" />
            )}
            {sessionContext.user.role === ROLES.ADMIN
              ? "Painel de controle administrativo"
              : "Dashboard"}
          </h1>

          <p>
            {sessionContext.user.role === ROLES.ADMIN
              ? "Visualize informações importantes sobre desafios, provas, produtos e gerencie usuários."
              : "Visualize algumas informações relevantes sobre seu perfil."}
          </p>
        </div>

        {sessionContext.user.role === ROLES.ADMIN && (
          <Sheet>
            <form>
              <SheetTrigger asChild>
                <Button variant="outline" className="bg-blue-600 text-white">
                  <Users className="w-4 h-4" />
                  Criar usuário
                </Button>
              </SheetTrigger>

              <SheetContent
                aria-describedby={undefined}
                className="overflow-auto flex flex-col p-4 w-full"
              >
                <SheetHeader className="p-0">
                  <SheetTitle className="font-semibold text-2xl flex gap-3 items-center flex-wrap">
                    <Users2 className="" />
                    Crie um novo usuário!
                  </SheetTitle>
                </SheetHeader>

                <CreateUserForms />
              </SheetContent>
            </form>
          </Sheet>
        )}
      </div>

      <div>
        {sessionContext.user.role === ROLES.ADMIN ? (
          <AdminDashboard />
        ) : (
          <UserDashboard />
        )}
      </div>
    </>
  );
}
