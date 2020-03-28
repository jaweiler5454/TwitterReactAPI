import React, { Component } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import CardStack, { Card } from "react-native-card-stack-swiper";

const DEVICE_WIDTH = Math.round(Dimensions.get("window").width);
const DEVICE_HEIGHT = Math.round(Dimensions.get("window").height);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#f2f2f2",
  },
  content: {
    flex: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: 0.95 * DEVICE_WIDTH,
    height: 0.8 * DEVICE_HEIGHT,
    // backgroundColor: "#FE474C",
  },
  card1: {
    backgroundColor: "#FE474C",
  },
  card2: {
    backgroundColor: "#FEB12C",
  },
  label: {
    lineHeight: 400,
    textAlign: "center",
    fontSize: 55,
    fontFamily: "System",
    color: "#ffffff",
    backgroundColor: "transparent",
  },
});

const cardStack = ["hello", "my", "name", "is", "jack"];

export default class HomeScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <CardStack
          style={styles.content}
          ref={(swiper) => {
            this.swiper = swiper;
          }}
        >
          {cardStack.map((cardName) => {
            return (
              <Card style={[styles.card, styles.card1]}>
                <Text style={styles.label}>{cardName}</Text>
              </Card>
            );
          })}
        </CardStack>
      </View>
    );
  }
}
