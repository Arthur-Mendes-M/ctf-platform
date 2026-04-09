import { cn } from "@/lib/utils";
import { Shield, Swords } from "lucide-react";
import React from "react";

export default function CTFLogo({
  variant = "short",
  className = ""
}: {
  variant?: "short" | "long";
  className?: string
}) {
  return (
    <div className={cn("flex gap-2 items-center flex-wrap", className)}>
      <div className="text-foreground flex size-8 items-center justify-center rounded-md">
        <div className={cn("relative size-6 text-ctf-blue", variant === "short" && "size-8")}>
          <Swords className={cn("size-3 absolute inset-0 m-auto", variant === "short" && "size-4")} />
          <Shield className={cn("size-6 stroke-1 absolute inset-0 m-auto", variant === "short" && "size-7")} />
        </div>
      </div>
      {variant === "long" && "Capture the Flag"}
    </div>
  );
}
