import { useEffect, useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ExamTimerProps {
  timeRemaining: number; // in seconds
}

export function ExamTimer({ timeRemaining }: ExamTimerProps) {
  const [time, setTime] = useState(timeRemaining);

  useEffect(() => {
    if (time <= 0) return;

    const timer = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);

  // const formatTime = (seconds: number) => {
  //   const fullHours = Math.floor(seconds / 3600);

  //   const days = Math.floor(fullHours / 24);

  //   const hoursWithoutDays = Math.floor(fullHours % 24);

  //   const minutes = Math.floor((seconds % 3600) / 60);
  //   const secs = seconds % 60;

  //   if (days > 0) {
  //     return `${days}D ${hoursWithoutDays}H:${minutes
  //       .toString()
  //       .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  //   }

  //   if (fullHours > 0) {
  //     return `${hoursWithoutDays}H:${minutes
  //       .toString()
  //       .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  //   }
  //   return `${minutes}:${secs.toString().padStart(2, "0")}`;
  // };

  const formatTime = (seconds: number) => {
    const fullHours = Math.floor(seconds / 3600);
    const days = Math.floor(fullHours / 24);
    const hours = fullHours % 24;
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
  
    const parts: string[] = [];
  
    if (days > 0) {
      parts.push(`${days}D`);
    }
  
    if (hours > 0) {
      parts.push(`${hours}H`);
    }
  
    if (minutes > 0 || (days === 0 && hours === 0)) {
      parts.push(minutes.toString().padStart(2, "0") + "M");
    }
  
    parts.push(secs.toString().padStart(2, "0") + "S");
  
    return parts.join(" ");
  };
  

  const isLowTime = time <= 300; // 5 minutes or less
  const isCriticalTime = time <= 60; // 1 minute or less

  return (
    <Button
      variant={"default"}
      tabIndex={-1}
      className={cn(
        "pointer-events-none cursor-default",
        isCriticalTime
          ? "bg-destructive/10 border-destructive text-destructive animate-pulse"
          : isLowTime
          ? "bg-warning/10 border-warning text-warning"
          : "bg-muted border-border text-foreground"
      )}
    >
      {isCriticalTime ? (
        <AlertTriangle className="w-5 h-5" />
      ) : (
        <Clock className="w-5 h-5" />
      )}
      <span className="font-semibold">{formatTime(time)}</span>
    </Button>
  );
}
