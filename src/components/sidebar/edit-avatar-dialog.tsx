"use client";

import {
  Dialog,
  DialogContent,
  // DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { UserRoundPen } from "lucide-react";
import { type LoggedUserType } from "@/utils/types/user";
import { useState } from "react";

export default function EditAvatarDialog({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: LoggedUserType;
}) {
  const [seed, setSeed] = useState("");

  const defaultAvatars = [
    process.env.NEXT_PUBLIC_AVATAR_API_URL + "1",
    process.env.NEXT_PUBLIC_AVATAR_API_URL + "2",
    process.env.NEXT_PUBLIC_AVATAR_API_URL + "3",
    process.env.NEXT_PUBLIC_AVATAR_API_URL + "4",
    process.env.NEXT_PUBLIC_AVATAR_API_URL + "5",
    process.env.NEXT_PUBLIC_AVATAR_API_URL + "6",
    process.env.NEXT_PUBLIC_AVATAR_API_URL + "7",
    process.env.NEXT_PUBLIC_AVATAR_API_URL + "8",
    process.env.NEXT_PUBLIC_AVATAR_API_URL + "9",
    process.env.NEXT_PUBLIC_AVATAR_API_URL + "10",
  ];

    defaultAvatars.forEach(avatar => {
        console.log("Avatar:", avatar)
    });

  const generateAvatarFromSeed = () => {
    if (seed.trim()) {
      user.avatar_url = process.env.AVATAR_API_URL + seed;
    }
  };

  const selectDefaultAvatar = (avatar: string) => {
    user.avatar_url = avatar;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-lg sm:rounded-xl px-4 py-6 max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <div className="w-full overflow-x-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <UserRoundPen className="h-5 w-5 text-blue-600" />
              Altere seu Avatar
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar_url || ""} alt={user.name} />
              <AvatarFallback>
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="space-y-6 mt-6">
            {/* Campo de seed */}
            <div className="space-y-3">
              <Label
                htmlFor="seed"
                className="text-sm font-medium text-card-foreground"
              >
                Insira uma seed para gerar um avatar
              </Label>
              <div className="flex gap-2">
                <Input
                  id="seed"
                  placeholder="Ex: gato espacial, robô amigável, flor colorida..."
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  className="flex-1 bg-input border-border text-foreground placeholder:text-muted-foreground"
                  onKeyDown={(e) =>
                    e.key === "Enter" && generateAvatarFromSeed()
                  }
                />
                <Button
                  onClick={generateAvatarFromSeed}
                  disabled={!seed.trim()}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
                >
                  Gerar
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Digite qualquer palavra ou frase para gerar um avatar único
              </p>
            </div>

            {/* Divisor */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  ou escolha um padrão
                </span>
              </div>
            </div>

            {/* Avatares padrões */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-card-foreground">
                Avatares padrões
              </Label>
              <div className="grid grid-cols-5 gap-3">
                {defaultAvatars.map((avatar, index) => (
                  <button
                    key={index}
                    onClick={() => selectDefaultAvatar(avatar)}
                    className="group relative aspect-square rounded-lg overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-200 cursor-pointer flex items-center justify-center"
                  >
                    <Avatar className="h-8 w-8 md:w-12 md:h-12">
                      <AvatarImage
                        src={avatar || ""}
                      />
                    </Avatar>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground text-xs">
                          ✓
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
