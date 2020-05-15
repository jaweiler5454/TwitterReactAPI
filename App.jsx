import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import Timeline from "./components/Timeline";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 100,
  },
});

function App() {
  return (
    <Timeline
      userId="TwitterDev"
      username="Twitter Dev"
      style={styles.container}
    />
  );
}
export default App;
