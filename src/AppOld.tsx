import React from "react";

import { SafeAreaView, StyleSheet, View, Button } from "react-native";

import { Timer, TimerPropsRef, TimerStatus } from "./components/Timer";

const App = () => {
  const timerRef = React.useRef<TimerPropsRef>(null);
  const [timerStatus, setTimerStatus] = React.useState<TimerStatus>("READY");

  const handleStatusChange = (status: TimerStatus) => {
    setTimerStatus(status);
  };

  const handleStart = () => {
    timerRef.current?.start();
  };

  const handlePause = () => {
    timerRef.current?.pause();
  };

  const handleReset = () => {
    timerRef.current?.reset();
  };

  React.useEffect(() => {
    console.log({ timerStatus });
  }, [timerStatus]);

  return (
    <SafeAreaView style={styles.container}>
      <Timer ref={timerRef} onStatusChange={handleStatusChange} seconds={5} textStyle={styles.timer} />
      <View style={styles.buttons}>
        <Button title="Start" onPress={handleStart} />
        <Button title="Pause" onPress={handlePause} />
        <Button title="Reset" onPress={handleReset} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttons: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  timer: {
    fontSize: 40,
  },
});

export default App;
