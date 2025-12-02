"use client";

import { useState, useEffect } from "react";
import { Save, ShieldUser, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreateUserType,
  ROLES,
  UserType,
} from "@/utils/types/user";
import SubmitButton from "@/components/submit-button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { clearUnmodifiedObjectKeys } from "@/utils/objects";

interface UserEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserType | null;
  onSave: (user: Partial<CreateUserType>, userId: string) => void;
}

export default function EditUserForms({
  user,
  open,
  onOpenChange,
  onSave,
}: UserEditDialogProps) {
  const [formData, setFormData] = useState<Partial<CreateUserType> | null>(user);
  const [wasChanged, setWasChanged] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  useEffect(() => {
    // const fieldsAreEqual = JSON.stringify(formData) == JSON.stringify(user);
    const someValueWasChange = clearUnmodifiedObjectKeys(formData!, user!);

    if (someValueWasChange) {
      setWasChanged(true);
    } else {
      setWasChanged(false);
    }
  }, [formData, user]);

  const handleInputChange = (field: keyof UserType, value: unknown) => {
    if (!formData) return;

    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    if (!formData) return;

    onSave(formData, user!.id);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!formData) return null;

  const Icon = user?.role === ROLES.ADMIN ? ShieldUser : User;
  const color = user?.role === ROLES.ADMIN ? "bg-blue-500" : "bg-green-500";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        aria-describedby={undefined}
        className="overflow-y-auto p-5 w-full"
      >
        <SheetHeader className="p-0">
          <SheetTitle className="flex gap-3 text-xl">
            <div
              className={`p-2 rounded-lg ${
                color || "bg-gray-500"
              }`}
            >
              <Icon className="h-5 w-5 text-white" />
            </div>
            Editar Usuário
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>
              Nome <span className="text-red-600">*</span>
            </Label>
            <Input
              required
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.currentTarget.value)}
              placeholder="Ex: João Silva"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>
              Email <span className="text-red-600">*</span>
            </Label>
            <Input
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.currentTarget.value)}
              placeholder="Ex: joao@exemplo.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>
              Cargo <span className="text-red-600">*</span>
            </Label>
            <Select
              value={formData.role}
              required
              onValueChange={(value) => handleInputChange("role", value)}
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
        </div>

        <SheetFooter className="gap-2">
          <Button variant="ghost" onClick={handleCancel}>
            Cancelar
          </Button>

          <SubmitButton onClick={handleSave} disabled={!wasChanged}>
            <Save className="h-4 w-4 mr-2" />
            Salvar alterações
          </SubmitButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
