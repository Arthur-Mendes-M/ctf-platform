import { getUserSession } from "@/utils/cookies";
import { StoreIcon } from "lucide-react";
import { ROLES } from "@/utils/types/user";
import UserStore from "./components/user/user-store";
import AdminStore from "./components/admin/admin-store";

export default async function Store() {
  const sessionContext = await getUserSession();

  return (
    <>
      <div className="mb-8 flex justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex gap-3 items-center">
            <StoreIcon className="w-8 h-8" />
            {sessionContext.user.role === ROLES.ADMIN ? "Loja de benefícios" : "Loja CTF"}
          </h1>
          <p>
            {sessionContext.user.role === ROLES.ADMIN
              ? " Gerencia os benefícios que os alunos/usuários do sistema podem usar"
              : "Troque seus Rubys por benefícios acadêmicos"}
          </p>
        </div>
      </div>

      {sessionContext.user.role === ROLES.ADMIN ? <AdminStore /> : <UserStore />}
    </>
  );
}
