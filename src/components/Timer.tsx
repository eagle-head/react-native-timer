import React from "react";

import { StyleProp, Text, TextStyle } from "react-native";

import { compact } from "../utils/compact";

type TimerProps = {
  minutes?: number;
  seconds?: number;
  textStyle?: StyleProp<TextStyle> | undefined | null;
  onStatusChange?: (status: TimerStatus) => void;
};

export type TimerStatus = "READY" | "RUNNING" | "PAUSED" | "FINALIZED";

export type TimerPropsRef = {
  start: () => void;
  pause: () => void;
  reset: () => void;
} | null;

function formatTimer(remainingTime: number) {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  const parts = [String(minutes).padStart(2, "0"), ":", String(seconds).padStart(2, "0")];

  return parts.join("");
}

export const Timer = React.forwardRef<TimerPropsRef, TimerProps>(
  ({ minutes = 0, seconds = 0, textStyle, onStatusChange }, ref) => {
    const [initialTime, setInitialTime] = React.useState(minutes * 60 + seconds);
    const [remainingTime, setRemainingTime] = React.useState(initialTime);
    const [isPaused, setIsPaused] = React.useState(true);
    const intervalRef = React.useRef<number | null>(null);
    const startTimeRef = React.useRef<number | null>(null);

    const updateStatus = React.useCallback(
      (newStatus: TimerStatus) => {
        onStatusChange?.(newStatus);
      },
      [onStatusChange]
    );

    const start = React.useCallback(() => {
      if (remainingTime === 0) {
        return;
      }

      updateStatus("RUNNING");
      setIsPaused(false);
      startTimeRef.current = Date.now() - (initialTime - remainingTime) * 1000;
    }, [initialTime, remainingTime, updateStatus]);

    const pause = React.useCallback(() => {
      if (remainingTime !== 0) {
        updateStatus("PAUSED");
      }

      setIsPaused(true);
    }, [remainingTime, updateStatus]);

    const reset = React.useCallback(() => {
      pause();
      updateStatus("READY");
      setRemainingTime(initialTime);
    }, [initialTime, pause, updateStatus]);

    React.useImperativeHandle(
      ref,
      () => ({
        start,
        pause,
        reset,
      }),
      [pause, reset, start]
    );

    React.useEffect(() => {
      if (!isPaused) {
        intervalRef.current = setInterval(() => {
          if (startTimeRef.current !== null) {
            const elapsedTime = Math.floor((Date.now() - startTimeRef.current) / 1000);

            const newRemainingTime = Math.max(initialTime - elapsedTime, 0);

            setRemainingTime(newRemainingTime);

            if (newRemainingTime === 0) {
              updateStatus("FINALIZED");
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
    }, [isPaused, initialTime, updateStatus]);

    React.useEffect(() => {
      const newInitialTime = minutes * 60 + seconds;
      setInitialTime(newInitialTime);
      setRemainingTime(newInitialTime);
    }, [minutes, seconds]);

    return (
      <Text style={compact([textStyle])} accessibilityRole="text">
        {formatTimer(remainingTime)}
      </Text>
    );
  }
);
