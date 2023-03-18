import React from "react";

import { SafeAreaView, StyleSheet, View, Button, Text } from "react-native";

import { useTimer } from "./hook/useTimer";

const App = () => {
  const {
    formattedTime,
    status,
    actions: { pause, reset, start },
  } = useTimer({ initialMinutes: 0, initialSeconds: 60 });

  const handleStart = () => {
    start();
  };

  const handlePause = () => {
    pause();
  };

  const handleReset = () => {
    reset();
  };

  React.useEffect(() => {
    console.log({ status });
  }, [status]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.timer} accessibilityRole="text">
        {formattedTime}
      </Text>
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
    fontSize: 60,
  },
});

export default App;
