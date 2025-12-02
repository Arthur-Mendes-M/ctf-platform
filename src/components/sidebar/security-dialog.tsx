"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "../password-input";
import { UserLock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { loggedResetPassword } from "@/utils/api/user";
import { passwordIsFormatted, passwordsAreEqual } from "@/utils/strings";
import { useState } from "react";

export function SecurityDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { mutate: handleResetPassword, isPending: isChangingPassword } = useMutation({
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();

      if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
        toast.warning("Os campos não podem estar vazios");
        return;
      }

      if (currentPassword === newPassword) {
        toast.warning("A nova senha não pode ser igual à senha atual.");
        return;
      }

      if(!passwordIsFormatted(newPassword)){
        toast.warning("A nova senha precisa estar no padrão")
        return;
      }

      if (!passwordsAreEqual(newPassword, confirmPassword)) {
        toast.warning("A nova senha precisa ser igual à senha confirmada.");
        return;
      }

      const formData = new FormData();
      formData.append("current-password", currentPassword);
      formData.append("new-password", newPassword);
      formData.append("confirm-new-password", confirmPassword);

      const res = await loggedResetPassword(formData);

      if (res.success) {
        toast.success("Senha redefinida com sucesso.");

        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("");

        onOpenChange(false);
      } else {
        toast.error(res.message);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-lg sm:rounded-xl px-4 py-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <UserLock className="h-5 w-5 text-blue-600" />
            Segurança da Conta
          </DialogTitle>
          <DialogDescription>
            Altere sua senha para manter sua conta segura.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleResetPassword} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Sua senha</Label>
            <PasswordInput
              id="current-password"
              name="current-password"
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Nova senha</Label>
            <PasswordInput
              id="new-password"
              name="new-password"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-new-password">Confirme a nova senha</Label>
            <PasswordInput
              id="confirm-new-password"
              name="confirm-new-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <p className="text-sm text-gray-500">
            A senha deve conter pelo menos um número, uma letra e um caractere especial.
          </p>
          <Button type="submit" className="w-full" disabled={isChangingPassword}>
            {
              isChangingPassword ? "Alterando a senha..." : "Salvar Nova Senha"
            }
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
