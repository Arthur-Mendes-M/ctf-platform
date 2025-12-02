"use client";
import { Button } from "@/components/ui/button";
import { ClockPlus, Terminal, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import { DateTime } from "luxon";

function calcSecondsLeft(expiresAt: string): number {
  const expiresAtDate = DateTime.fromISO(expiresAt, { zone: "utc" }).setZone(
    "America/Sao_Paulo"
  );

  const now = DateTime.local();
  const secondsLeft = Math.floor(expiresAtDate.diff(now, "seconds").seconds);

  return secondsLeft;
}

export default function TerminalWindow({
  terminal_url,
  expiresAt,
  visibility = false,
  onClose,
  increaseTimer,
  props
}: {
  terminal_url: string;
  visibility: boolean;
  expiresAt: string;
  onClose: () => void;
  increaseTimer: () => void;
  props?: {width?: string | number, height?: string | number, x?: number, y?: number}
}) {
  const [timer, setTimer] = useState(0);

  const handleAddTime = () => {
    if (timer < 30 * 60) {
      increaseTimer();
    }
  };

  useEffect(() => {
    if (visibility && terminal_url) {
      setTimer(calcSecondsLeft(expiresAt));
    }
  }, [visibility, terminal_url, expiresAt]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          const rounded = Math.round(prev - 1);

          return rounded;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  });

  if (!visibility) return null;

  return (
    <Rnd
      default={{
        x: props?.x ?? 0,
        y: props?.y ?? 0,
        width: props?.width ?? "90%",
        height: props?.height ?? 300,
      }}
      minWidth={200}
      minHeight={200}
      bounds="window"
      style={{
        border: "1px solid #444",
        borderRadius: "8px",
        background: "#000",
        zIndex: 9999,
        overflow: "hidden",
        boxShadow: "0 0 10px rgba(0,0,0,0.5)",
        position: "fixed",
        transform: "none",
        inset: 0,
        top: 0,
        right: 0,
        left: 0,
        bottom: 0
      }}
    >
      <div className="flex justify-between gap-3 flex-wrap bg-[#222] text-[#fff] p-1">
        <div className="flex items-start flex-col gap-2">
          <div className="flex gap-6 items-center">
            <h1 className="flex gap-2">
              <Terminal />
              Terminal
            </h1>

            <div className="flex flex-col gap-2 items-start min-w-full grow">
              <h3 className="text-sm">
                Restam:{" "}
                {Math.floor(timer / 60)
                  .toString()
                  .padStart(2, "0")}
                min {(timer % 60).toString().padStart(2, "0")}s
              </h3>
            </div>
          </div>

          {timer <= 1800 && (
            <Button
              onClick={handleAddTime}
              className="border-none bg-transparent font-normal p-1 font-mono"
            >
              <ClockPlus />
              Adicionar 30min
            </Button>
          )}
        </div>
        <Button
          onClick={() => {
            setTimer(0);
            onClose();
          }}
          variant="destructive"
          size="icon"
        >
          <X />
        </Button>
      </div>
      <iframe
        src={terminal_url}
        width="100%"
        height="100%"
        frameBorder="0"
        title="Terminal"
      />
    </Rnd>
  );
}
