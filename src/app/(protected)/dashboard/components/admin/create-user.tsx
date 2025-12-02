"use client";

import { FormEvent, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  AlertTriangle,
  LoaderCircle,
  Plus,
  ShieldUser,
  User,
  UserPlus,
  X,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { createUsers } from "@/utils/api/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateUserType, defaultEmptyUser, ROLES } from "@/utils/types/user";
import { toast } from "sonner";
import SubmitButton from "@/components/submit-button";
import { AdminDashboardResponseType } from "@/utils/types/dashboard";

export default function CreateUserForms() {
  const queryClient = useQueryClient();
  const [formUser, setFormUser] = useState<CreateUserType>({
    ...defaultEmptyUser,
  });
  const [usersList, setUsersList] = useState<CreateUserType[]>([]);

  const nameInputRef = useRef<HTMLInputElement>(null);

  const { mutate: createUserMutation, isPending: creatingUsers } = useMutation({
    mutationKey: ["admin-stats"],
    mutationFn: async () => await createUsers(usersList),
    onSuccess(data) {
      if (data.success) {
        const { users, errors } = data.data;
        toast.dismiss("create-user");

        if (errors && errors.length > 0) {
          toast.error(data.message);

          queryClient.setQueryData(
            ["admin-stats"],
            (oldData: AdminDashboardResponseType) => {
              return {
                ...oldData,
                users: [...oldData.users, ...users],
              };
            }
          );

          setUsersList((oldList) =>
            oldList
              .filter((item) =>
                errors.some((err: CreateUserType) => err.email === item.email)
              )
              .map((item) => {
                const errorInfo = errors.find(
                  (err: CreateUserType) => err.email === item.email
                );
                return {
                  ...item,
                  message: errorInfo?.error, // ou qualquer nome de campo que represente o erro
                };
              })
          );

          return;
        }

        setUsersList([]);
        toast.success(data.message);

        queryClient.setQueryData(
          ["admin-stats"],
          (oldData: AdminDashboardResponseType) => {
            return {
              ...oldData,
              users: [...oldData.users, ...users],
            };
          }
        );
      } else {
        toast.error("Erro ao criar usuários", {
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

  const handleRemoveUser = (index: number) => {
    setUsersList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submitter = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement;

    if (submitter?.name === "add") {
      // Adicionar à lista
      if (!formUser.name.trim() || !formUser.email.trim() || !formUser.role) {
        toast.warning("Preencha todos os campos obrigatórios.");
        return;
      }

      setUsersList((prev) => [...prev, formUser]);
      setFormUser({ ...defaultEmptyUser });

      // setTimeout(() => {
      nameInputRef.current?.focus();
      // }, 0);
      return;
    }

    if (submitter?.name === "submit") {
      // Criar usuários
      const hasInvalid = usersList.some(
        (u) => !u.name.trim() || !u.email.trim()
      );

      if (usersList.length === 0 || hasInvalid) {
        toast.warning("Adicione ao menos um usuário válido.");
        return;
      }

      toast.info("Criando usuários...", { id: "create-user" });
      createUserMutation();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="grid gap-6 py-4">
        <div className="space-y-4">
          <Label className="text-xl font-semibold">Novo usuário</Label>

          <div className="flex flex-col gap-2">
            <Label>
              Nome <span className="text-red-600">*</span>
            </Label>
            <Input
              ref={nameInputRef}
              value={formUser.name}
              onChange={(e) =>
                setFormUser((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Ex: João Silva"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>
              Email <span className="text-red-600">*</span>
            </Label>
            <Input
              type="email"
              value={formUser.email}
              onChange={(e) =>
                setFormUser((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="Ex: joao@exemplo.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>
              Cargo <span className="text-red-600">*</span>
            </Label>
            <Select
              value={formUser.role}
              onValueChange={(value) =>
                setFormUser((prev) => ({ ...prev, role: value as ROLES }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cargo" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ROLES).map((role) => {
                  const Icon = role === ROLES.ADMIN ? ShieldUser : User;
                  const color =
                    role === ROLES.ADMIN ? "bg-blue-500" : "bg-green-500";

                  return (
                    <SelectItem key={role} value={role}>
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded ${color}`}>
                          <Icon className="h-3 w-3 text-white" />
                        </div>
                        {role}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" variant="outline" name="add">
            <Plus className="h-4 w-4 mr-1" />
            Confirmar adição
          </Button>
        </div>

        <SubmitButton
          name="submit"
          type="submit"
          disabled={
            usersList.length === 0 ||
            usersList.some((u) => !u.name.trim() || !u.email.trim()) ||
            creatingUsers
          }
        >
          {creatingUsers ? (
              <>
                <LoaderCircle className="animate-spin h-4 w-4 mr-1" />
                Criando usuários...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Criar usuários
              </>
            )}
        </SubmitButton>

        {usersList.length > 0 && (
          <div className="border-t pt-4 space-y-2">
            <Label className="text-sm font-medium">
              Usuários que serão adicionados
            </Label>
            <ul className="space-y-1 text-sm">
              {usersList.map((user, index) => (
                <li
                  key={index}
                  className={`flex justify-between items-center border px-3 py-2 rounded relative`}
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-lg">
                      <strong>{user.name}</strong> - {user.email} ({user.role})
                    </span>

                    {user?.message && (
                      <span className="text-sm text-red-500">
                        {user.message}
                      </span>
                    )}

                    {user?.message && (
                      <AlertTriangle className="w-6 h-6 text-red-400 absolute -top-[12px] -right-[12px]" />
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveUser(index)}
                  >
                    <X className="h-8 w-8 text-red-500" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
}
