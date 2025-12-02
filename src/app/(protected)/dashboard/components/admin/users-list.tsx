"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminDashboardResponseType } from "@/utils/types/dashboard";
import { CreateUserType, UserType } from "@/utils/types/user";
import { Edit, Gem, Trash2, Users, Zap } from "lucide-react";
import EditUserForms from "./user-edit";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser, updateUser } from "@/utils/api/admin";
import { clearUnmodifiedObjectKeys } from "@/utils/objects";

export default function UsersList({
  stats,
}: {
  stats?: AdminDashboardResponseType;
}) {
  const queryClient = useQueryClient();

  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const updateMutation = useMutation({
    mutationKey: ["admin-stats"],
    mutationFn: async ({user, userId}:{user: Partial<CreateUserType>, userId: string}) => {
      return await updateUser(user, userId);
    },
    onSuccess(apiResponse) {
      toast.dismiss("update-user");
      if (apiResponse.success) {
        toast.success(apiResponse.message);
        queryClient.setQueryData(
          ["admin-stats"],
          (oldData: AdminDashboardResponseType) => {
            const cleanUsers = oldData.users.map((user) =>
              user.id == apiResponse.data.id ? apiResponse.data : user
            );

            return {
              ...oldData,
              users: cleanUsers,
            };
          }
        );
      } else {
        toast.error("Algo deu errado! Favor tente novamente.", {
          description: apiResponse.message,
        });
      }
    },
    onError(error) {
      toast.error("Algo deu errado! Favor tente novamente.", {
        description: error.message,
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationKey: ["admin-stats"],
    mutationFn: async (user: UserType) => await deleteUser(user.id),
    onSuccess(data, user) {
      if (data.success) {
        toast.dismiss("delete-user");
        toast.success(data.message);

        queryClient.setQueryData(
          ["admin-stats"],
          (oldData: AdminDashboardResponseType) => {
            return {
              ...oldData,
              users: oldData.users.filter(oldUser => oldUser.id !== user.id),
            };
          }
        );
      } else {
        toast.error("Erro ao deletar usuário", {
          description: data.message,
        });
      }
    },
    onError(error) {
      toast.error("Algo deu errado!", {
        description: error.message,
      });
    },
  });

  const handleEdit = (user: UserType) => {
    setEditingUser(user);
    setDialogOpen(true);
  };

  const handleSaveUser = (updatedUser: Partial<CreateUserType>, userId: string) => {
    toast.info(
      `Atualizando as informações do usuário [${updatedUser.name}]...`,
      { id: "update-user" }
    );

    updateMutation.mutate(
      {user: clearUnmodifiedObjectKeys(editingUser!, updatedUser)!,
      userId}
    );
  };

  const handleDeleteUser = (user: UserType) => {
    toast.warning(`Atenção! Confirmação necessária.`, {
      description: `Você deseja mesmo deletar o usuário ${user.name}?`,
      id: "delete-user-confirm",
      action: {
        label: "Confirmar deleção!",
        onClick() {
          toast.info(`Deletando usuário ${user.name}...`, {
            id: "delete-user",
          });

          deleteUserMutation.mutate(user);
        },
      },
    });
  };

  if (!stats || stats.users.length == 0) {
    return (
      <div className="text-center py-8">
        <Users className="h-12 w-12 mx-auto mb-4" />
        <p>Nenhum usuário criado ainda</p>
        <p className="text-sm">Crie um usuário no botão azul acima!</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table className="bg-card shadow-sm">
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Nome</TableHead>
            <TableHead className="font-semibold">Email</TableHead>
            <TableHead className="font-semibold">Ativo</TableHead>
            <TableHead className="font-semibold">Acesso</TableHead>
            <TableHead className="font-semibold">Ruby</TableHead>
            <TableHead className="font-semibold w-24">XP</TableHead>
            <TableHead className="font-semibold w-32 text-center">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stats.users.map((user: UserType) => {
            return (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>

                <TableCell>
                  <span>{user.email}</span>
                </TableCell>

                <TableCell>
                  <span>
                    {user.hidden == true ? "Não" : "Sim"}
                  </span>
                </TableCell>

                <TableCell>
                  <span>{user.role}</span>
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className="text-ctf-red"
                  >
                    <Gem className="h-3 w-3 mr-1" />
                    {user?.ruby?.toLocaleString() || 0}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className="text-ctf-blue"
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    {user?.xp?.toLocaleString() || 0} XP
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(user)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4 text-ctf-blue" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUser(user)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4 text-ctf-red" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <EditUserForms
        user={editingUser}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveUser}
      />
    </div>
  );
}
