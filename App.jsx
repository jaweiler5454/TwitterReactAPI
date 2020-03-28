import React from "react";
import { StyleSheet } from "react-native";
import HomeScreen from "./screens/HomeScreen";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#eaeaea",
  },
});

function App() {
  return <HomeScreen style={styles.container} />;
}
export default App;
