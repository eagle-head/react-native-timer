import React from "react";

type TimerStatus = "READY" | "RUNNING" | "PAUSED" | "FINALIZED";

type TimerActions = {
  start: () => void;
  pause: () => void;
  reset: () => void;
};

type UseTimerProps = {
  initialMinutes?: number;
  initialSeconds?: number;
};

type UseTimerReturn = {
  formattedTime: string;
  status: TimerStatus;
  actions: TimerActions;
};

export const useTimer = ({ initialMinutes = 0, initialSeconds = 0 }: UseTimerProps): UseTimerReturn => {
  const initialTime = initialMinutes * 60 + initialSeconds;
  const [remainingTime, setRemainingTime] = React.useState(initialTime);
  const [status, setStatus] = React.useState<TimerStatus>("READY");
  const [isPaused, setIsPaused] = React.useState(true);
  const intervalRef = React.useRef<number | null>(null);
  const startTimeRef = React.useRef<number | null>(null);

  const start = React.useCallback(() => {
    if (remainingTime === 0) {
      return;
    }

    // Only start the timer if the current status is 'READY' or 'PAUSED'
    if (status !== "READY" && status !== "PAUSED") {
      return;
    }

    setStatus("RUNNING");
    setIsPaused(false);
    startTimeRef.current = Date.now() - (initialTime - remainingTime) * 1000;
  }, [initialTime, remainingTime, status]);

  const pause = React.useCallback(() => {
    if (remainingTime !== 0) {
      setStatus("PAUSED");
    }

    setIsPaused(true);
  }, [remainingTime]);

  const reset = React.useCallback(() => {
    pause();
    setStatus("READY");
    setRemainingTime(initialTime);
  }, [initialTime, pause]);

  React.useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current !== null) {
          const elapsedTime = Math.floor((Date.now() - startTimeRef.current) / 1000);

          const newRemainingTime = Math.max(initialTime - elapsedTime, 0);

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
  }, [isPaused, initialTime]);

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
