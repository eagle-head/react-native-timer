// App.tsx
import React from "react";
import { SafeAreaView, StyleSheet, View, Button } from "react-native";
import { Timer, TimerPropsRef } from "./components/Timer";

const App = () => {
  const timerRef = React.useRef<TimerPropsRef>(null);

  return (
    <SafeAreaView style={styles.container}>
      <Timer ref={timerRef} seconds={15} textStyle={styles.timer} />
      <View style={styles.buttons}>
        <Button title="Start" onPress={() => timerRef.current?.start()} />
        <Button title="Pause" onPress={() => timerRef.current?.pause()} />
        <Button title="Reset" onPress={() => timerRef.current?.reset()} />
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
