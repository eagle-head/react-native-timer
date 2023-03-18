// hook/useTimer.test.ts
import { renderHook, act } from "@testing-library/react-hooks";
import { waitFor } from "@testing-library/react-native";

import { useTimer } from "../useTimer";

jest.useFakeTimers();

describe("useTimer", () => {
  it("should initialize with correct default values", () => {
    const { result } = renderHook(() => useTimer({ initialMinutes: 0, initialSeconds: 10 }));

    expect(result.current.formattedTime).toBe("00:10");
    expect(result.current.status).toBe("READY");
  });

  it("should start the timer and update the status and remaining time", async () => {
    const { result } = renderHook(() => useTimer({ initialMinutes: 0, initialSeconds: 10 }));

    act(() => {
      result.current.actions.start();
    });

    await waitFor(() => {
      expect(result.current.status).toBe("RUNNING");
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(result.current.formattedTime).toBe("00:08");
    });
  });

  it("should pause the timer and update the status", async () => {
    const { result } = renderHook(() => useTimer({ initialMinutes: 0, initialSeconds: 10 }));

    act(() => {
      result.current.actions.start();
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    act(() => {
      result.current.actions.pause();
    });

    await waitFor(() => {
      expect(result.current.status).toBe("PAUSED");
      expect(result.current.formattedTime).toBe("00:08");
    });
  });

  it("should reset the timer and update the status", async () => {
    const { result } = renderHook(() => useTimer({ initialMinutes: 0, initialSeconds: 10 }));

    act(() => {
      result.current.actions.start();
      jest.advanceTimersByTime(2000);
      result.current.actions.reset();
    });

    await waitFor(() => {
      expect(result.current.status).toBe("READY");
      expect(result.current.formattedTime).toBe("00:10");
    });
  });

  it("should finalize the timer and update the status", async () => {
    const { result } = renderHook(() => useTimer({ initialMinutes: 0, initialSeconds: 2 }));

    act(() => {
      result.current.actions.start();
      jest.advanceTimersByTime(3000);
    });

    await waitFor(() => {
      expect(result.current.status).toBe("FINALIZED");
      expect(result.current.formattedTime).toBe("00:00");
    });
  });
});
