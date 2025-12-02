"use client";

import {
  Fingerprint,
  Headset,
  LogOut,
  Palette,
  ShieldHalf,
  Pencil,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { LoggedUserType } from "@/utils/types/user";
import { toast } from "sonner";
import { logoutUser } from "@/utils/api/user";
import { useState } from "react";
import { PersonalDataDialog } from "./personal-data-dialog";
import { SecurityDialog } from "./security-dialog";
import  EditAvatarDialog from "./edit-avatar-dialog";
import SupportDialog from "../support-dialog";
import { useTheme } from "next-themes";

export function NavUser({ user }: { user: LoggedUserType }) {
  const { isMobile } = useSidebar();
  const { theme, setTheme } = useTheme();
  const [isPersonalDataOpen, setIsPersonalDataOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isEditAvatarOpen, setIsEditAvatarOpen] = useState(false);

  function handleLogout() {
    toast.warning("Você realmente deja sair do sistema?", {
      action: { label: "Sim, sair!", onClick: () => logoutUser() },
      closeButton: true,
    });
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar_url || ""} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="relative group h-8 w-8 rounded-lg cursor-pointer">
                    <AvatarImage src={user.avatar_url || ""} alt={user.name} />
                    <AvatarFallback className="rounded-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                    <div
                      onClick={() => setIsEditAvatarOpen(true)}
                      className="absolute inset-0 flex items-center justify-center 
                                bg-black/40 opacity-0 group-hover:opacity-100 
                                transition-opacity rounded-lg"
                    >
                      <Pencil className="w-4 h-4 text-white" />
                    </div>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    setTheme(theme === "dark" ? "light" : "dark");
                  }}
                >
                  <Palette />
                  Alterar tema
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setIsPersonalDataOpen(true)}>
                  <Fingerprint />
                  Dados da conta
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsSecurityOpen(true)}>
                  <ShieldHalf />
                  Segurança
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsSupportOpen(true)}>
                  <Headset />
                  Suporte
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  handleLogout();
                }}
              >
                <LogOut />
                Sair do sistema
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <PersonalDataDialog
        open={isPersonalDataOpen}
        onOpenChange={setIsPersonalDataOpen}
        user={user}
      />
      <EditAvatarDialog open={isEditAvatarOpen} onOpenChange={setIsEditAvatarOpen} user={user} />
      <SecurityDialog open={isSecurityOpen} onOpenChange={setIsSecurityOpen} />
      <SupportDialog open={isSupportOpen} onOpenChange={setIsSupportOpen} />
    </>
  );
}
