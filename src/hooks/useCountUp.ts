import React from "react";

type CountUpStatus = "READY" | "RUNNING" | "PAUSED" | "FINALIZED";

type CountUpActions = {
  start: () => void;
  pause: () => void;
  reset: () => void;
};

type UseCountUpProps = {
  maxSeconds: number;
};

type UseCountUpReturn = {
  formattedTime: string;
  status: CountUpStatus;
  actions: CountUpActions;
};

export const useCountUp = ({ maxSeconds }: UseCountUpProps): UseCountUpReturn => {
  if (maxSeconds <= 0) {
    throw new Error("maxSeconds must be greater than 0.");
  }

  const [elapsedTime, setElapsedTime] = React.useState(0);
  const [status, setStatus] = React.useState<CountUpStatus>("READY");
  const [isPaused, setIsPaused] = React.useState(true);
  const intervalRef = React.useRef<number | null>(null);
  const startTimeRef = React.useRef<number | null>(null);

  const start = React.useCallback(() => {
    if (elapsedTime === maxSeconds) {
      return;
    }

    if (status !== "READY" && status !== "PAUSED") {
      return;
    }

    setStatus("RUNNING");
    setIsPaused(false);
    startTimeRef.current = Date.now() - elapsedTime * 1000;
  }, [maxSeconds, elapsedTime, status]);

  const pause = React.useCallback(() => {
    if (elapsedTime !== maxSeconds) {
      setStatus("PAUSED");
    }

    setIsPaused(true);
  }, [elapsedTime, maxSeconds]);

  const reset = React.useCallback(() => {
    pause();
    setStatus("READY");
    setElapsedTime(0);
  }, [pause]);

  React.useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current !== null) {
          const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);

          const newElapsedTime = Math.min(elapsed, maxSeconds);

          setElapsedTime(newElapsedTime);

          if (newElapsedTime === maxSeconds) {
            setStatus("FINALIZED");
            setIsPaused(true);
          }
        }
      }, 250);
    } else if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, maxSeconds]);

  const formatTimer = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const parts = [String(minutes).padStart(2, "0"), ":", String(seconds).padStart(2, "0")];

    return parts.join("");
  };

  const formattedTime = formatTimer(elapsedTime);

  return {
    formattedTime,
    status,
    actions: { start, pause, reset },
  };
};
