"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Zap, Gem, Mail, User, UserSearch } from "lucide-react";
import { type LoggedUserType } from "@/utils/types/user";

export function PersonalDataDialog({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: LoggedUserType;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-lg sm:rounded-xl px-4 py-6 max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <div className="w-full overflow-x-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <UserSearch className="h-5 w-5 text-blue-600" />
              Dados Pessoais
            </DialogTitle>
            <DialogDescription>
              Suas informações pessoais no CTF Arena
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 w-full rounded-lg bg-muted/50 text-center sm:text-left">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar_url || ""} alt={user.name} />
                <AvatarFallback>
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2 w-full break-words">
                <h3 className="text-lg sm:text-xl font-semibold break-words">
                  {user.name}
                </h3>
                <p className="text-sm text-muted-foreground break-all">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-blue-100">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Nome Completo</p>
                    <p className="text-sm text-muted-foreground">
                      Seu nome de usuário
                    </p>
                  </div>
                </div>
                <span className="font-medium text-right">{user.name}</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-green-100">
                    <Mail className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">
                      Seu endereço de email
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium text-right">
                  {user.email}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-blue-100">
                    <Zap className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Experiência</p>
                    <p className="text-sm text-muted-foreground">
                      Total de XP acumulado
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="border-blue-200 text-blue-700 font-semibold"
                >
                  <Zap className="h-3 w-3 mr-1" />
                  {user.xp.toLocaleString()} XP
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-red-100">
                    <Gem className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium">Ruby</p>
                    <p className="text-sm text-muted-foreground">
                      Moeda do jogo
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="border-red-200 text-red-600 font-semibold"
                >
                  <Gem className="h-3 w-3 mr-1" />
                  {user.ruby.toLocaleString()}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
