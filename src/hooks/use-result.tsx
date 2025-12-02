"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ResponseStandard } from "@/utils/types/_patterns";

const DEFAULT_DURATION = 5 * 1000; // fallback 5s

type UseResultOptions = {
  duration?: number; // tempo em ms (opcional)
};

export function useResult({ duration = DEFAULT_DURATION }: UseResultOptions = {}) {
  const [result, _setResult] = useState<ResponseStandard | null>(null);
  const [messageTimer, setMessageTimer] = useState<number>(duration);
  const intervalRef = useRef<number | null>(null);

  const setResult = (r: ResponseStandard | null) => {
    _setResult(r);
  };

  useEffect(() => {
    if (!result) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    setMessageTimer(duration);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    intervalRef.current = window.setInterval(() => {
      setMessageTimer((old) => {
        const next = old - 100;
        if (next <= 0) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          _setResult(null);
          return 0;
        }
        return next;
      });
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [result, duration]);

  const ResultComponent = useMemo(() => {
    if (!result) return null;

    return (
      <div
        className={`py-2 px-3 flex flex-col gap-2 rounded-sm text-sm bg-secondary`}
      >
        <div className="flex gap-2 items-center">
          {
            result.success ? (
              <ShieldCheck className="size-4 opacity-60 text-chart-2" />
            ) : (
              <ShieldAlert className="size-4 opacity-60 text-chart-5" />
            )
          }
          {result.message}
        </div>
        <Progress
          value={(messageTimer / duration) * 100}
          className="opacity-60 h-1 w-full bg-primary-foreground"
          progressIndicatorClassName="bg-muted-foreground"
        />
      </div>
    );
  }, [result, messageTimer, duration]);

  return { ResultComponent, setResult };
}
