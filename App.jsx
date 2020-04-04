import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import HomeScreen from "./screens/HomeScreen";
import Timeline from "./components/Timeline";

const DEVICE_WIDTH = Math.round(Dimensions.get("window").width);
const DEVICE_HEIGHT = Math.round(Dimensions.get("window").height);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 100,
  },
});

function App() {
  return <Timeline style={styles.container} />;
}
export default App;
