import React from "react";

type CountdownStatus = "READY" | "RUNNING" | "PAUSED" | "FINALIZED";

type CountdownActions = {
  start: () => void;
  pause: () => void;
  reset: () => void;
};

type UseCountdownProps = {
  initialSeconds: number;
};

type UseCountdownReturn = {
  formattedTime: string;
  status: CountdownStatus;
  actions: CountdownActions;
};

export const useCountdown = ({ initialSeconds }: UseCountdownProps): UseCountdownReturn => {
  if (initialSeconds <= 0) {
    throw new Error("initialSeconds must be greater than 0.");
  }

  const [remainingTime, setRemainingTime] = React.useState(initialSeconds);
  const [status, setStatus] = React.useState<CountdownStatus>("READY");
  const [isPaused, setIsPaused] = React.useState(true);
  const intervalRef = React.useRef<number | null>(null);
  const startTimeRef = React.useRef<number | null>(null);

  const start = React.useCallback(() => {
    if (remainingTime === 0) {
      return;
    }

    if (status !== "READY" && status !== "PAUSED") {
      return;
    }

    setStatus("RUNNING");
    setIsPaused(false);
    startTimeRef.current = Date.now() - (initialSeconds - remainingTime) * 1000;
  }, [initialSeconds, remainingTime, status]);

  const pause = React.useCallback(() => {
    if (remainingTime !== 0) {
      setStatus("PAUSED");
    }

    setIsPaused(true);
  }, [remainingTime]);

  const reset = React.useCallback(() => {
    pause();
    setStatus("READY");
    setRemainingTime(initialSeconds);
  }, [initialSeconds, pause]);

  React.useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current !== null) {
          const elapsedTime = Math.floor((Date.now() - startTimeRef.current) / 1000);

          const newRemainingTime = Math.max(initialSeconds - elapsedTime, 0);

          setRemainingTime(newRemainingTime);

          if (newRemainingTime === 0) {
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
  }, [isPaused, initialSeconds]);

  const formatTimer = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const parts = [String(minutes).padStart(2, "0"), ":", String(seconds).padStart(2, "0")];

    return parts.join("");
  };

  const formattedTime = formatTimer(remainingTime);

  return {
    formattedTime,
    status,
    actions: { start, pause, reset },
  };
};
