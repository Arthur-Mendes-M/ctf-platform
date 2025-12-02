"use client";

import type * as React from "react";
import {
  ChartArea,
  ClipboardList,
  LandPlot,
  Store,
  Swords,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { LoggedUserType, ROLES } from "@/utils/types/user";
import CTFLogo from "../ctf-logo";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar> & {user: LoggedUserType}) {
  const pathname = usePathname();

  const routes = [
    { url: "/dashboard",title: "Dashboard", icon: ChartArea },
    { url: "/challenge", title: "Desafios", icon: Swords },
    { url: "/exams", title: "Exames", icon: ClipboardList },
    { url: "/ranking", title: "Ranking", icon: LandPlot },
    { url: "/store", title: "Loja", icon: Store },
  ];
  
  const data = {
    navMain: routes.map(route => ({
      ...route,
      title: route.title === "/dashboard" && props.user.role === ROLES.ADMIN ? "Painel" : route.title,
      isActive: pathname?.includes(route.url)
    })),
  };

  const {open} = useSidebar()
  
  return (
    <Sidebar collapsible="icon" className={cn("rounded-md max-h-[98vh] ml-2 z-50 overflow-hidden my-auto border-0 group-data-[side=left]:border-r-0")} {...props}>
      <SidebarHeader>
        <CTFLogo variant={open ? "long" : "short"} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={props.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
