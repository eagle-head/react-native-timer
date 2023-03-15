import React from "react";
import { render, screen, act, cleanup } from "@testing-library/react-native";
import { Timer, TimerPropsRef } from "../Timer";

describe("Timer", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it("renders the initial time", () => {
    render(<Timer minutes={1} seconds={30} />);

    const timer = screen.getByRole("text", { name: /01:30/i });
    expect(timer).toBeTruthy();
  });

  it("starts the timer", async () => {
    const ref = React.createRef<TimerPropsRef>();
    render(<Timer ref={ref} minutes={1} seconds={30} />);

    act(() => {
      ref.current!.start();
      jest.advanceTimersByTime(1000);
    });

    const timer = await screen.findByRole("text", { name: /01:30/i });
    expect(timer).toBeTruthy();
  });

  it("pauses the timer", async () => {
    const ref = React.createRef<TimerPropsRef>();
    render(<Timer ref={ref} minutes={1} seconds={30} />);

    act(() => {
      ref.current!.start();
      jest.advanceTimersByTime(1000);
    });

    const timer = await screen.findByRole("text", { name: /01:29/i });
    expect(timer).toBeTruthy();

    act(() => {
      ref.current!.pause();
      jest.advanceTimersByTime(1000);
    });

    const updatedTimer = await screen.findByRole("text", { name: /01:28/i });
    expect(updatedTimer).toBeTruthy();
  });

  it("resets the timer", () => {
    const ref = React.createRef<TimerPropsRef>();
    render(<Timer ref={ref} minutes={1} seconds={30} />);

    act(() => {
      ref.current!.start();
      jest.advanceTimersByTime(1000);
      ref.current!.reset();
    });

    const timer = screen.getByRole("text", { name: /01:30/i });
    expect(timer).toBeTruthy();
  });

  it("updates the timer when minutes prop changes", () => {
    render(<Timer minutes={1} seconds={30} />);

    const timer = screen.getByRole("text", { name: /01:30/i });
    expect(timer).toBeTruthy();

    act(() => {
      screen.update(<Timer minutes={2} seconds={30} />);
    });

    const updatedTimer = screen.getByRole("text", { name: /02:30/i });
    expect(updatedTimer).toBeTruthy();
  });

  it("updates the timer when seconds prop changes", () => {
    render(<Timer minutes={1} seconds={30} />);

    const timer = screen.getByRole("text", { name: /01:30/i });
    expect(timer).toBeTruthy();

    act(() => {
      screen.update(<Timer minutes={1} seconds={45} />);
    });

    const updatedTimer = screen.getByRole("text", { name: /01:45/i });
    expect(updatedTimer).toBeTruthy();
  });
});
