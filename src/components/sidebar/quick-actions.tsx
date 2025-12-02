"use client";

// import { Gem, Search, Zap } from "lucide-react";
import { Gem, Zap } from "lucide-react";
// import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";
import { LoggedUserType } from "@/utils/types/user";

export function QuickActions({user}: {user: LoggedUserType}) {

  return (
    <div className="flex md:justify-end items-center w-full gap-2">
      {/* <Button variant="ghost" size="sm" className="h-8 w-8 p-0 order-1 md:order-none">
        <Search className="h-4 w-4" />
        <span className="sr-only">Buscar</span>
      </Button> */}

      <div className="flex gap-4">
        <Badge variant="outline" className="text-ctf-blue border-0 pl-0 md:pr-0">
          <Zap className="h-3 w-3" />
          {user?.xp?.toLocaleString() || 0}
        </Badge>
        <Badge variant="outline" className="text-ctf-red border-0 pl-0 md:pr-0">
          <Gem className="h-3 w-3" />
          {user?.ruby?.toLocaleString() || 0}
        </Badge>
      </div>
    </div>
  );
}
