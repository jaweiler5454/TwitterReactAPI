import React, { Component } from "react";
import { StyleSheet, View, Dimensions, Animated, Text } from "react-native";
import WebView from "react-native-webview";
import CardStack from "react-native-card-stack-swiper";

const DEVICE_WIDTH = Math.round(Dimensions.get("window").width);
const DEVICE_HEIGHT = Math.round(Dimensions.get("window").height);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#f2f2f2",
  },
  card: {
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT,
    // borderRadius: 25,
  },
});

const cardStack = [
  { id: "1", username: "jackdblu" },
  { id: "2", username: "jackdblu" },
  { id: "3", username: "jackdblu" },
  { id: "4", username: "jackdblu" },
  { id: "5", username: "jackdblu" },
];

function profileUrl(username) {
  return "<a class='twitter-timeline' data-aria-polite='assertive' data-chrome='noheader' href='https://twitter.com/"
    .concat(username)
    .concat("?ref_src=twsrc%5Etfw'>")
    .concat(
      "</a> <script async src='https://platform.twitter.com/widgets.js' charset='utf-8'></script>"
    );
}

function tweetHtml() {
  return "<blockquote class='twitter-tweet'><p lang='en' dir='ltr'>Update: We’re continuing to see increased wait times for developer applications and expect to see improvement over the next week. <br><br>Thank you for your patience, and we’ll continue to keep you updated. <a href='https://t.co/IQId3AiAxd'>https://t.co/IQId3AiAxd</a></p>&mdash; Twitter Dev (@TwitterDev) <a href='https://twitter.com/TwitterDev/status/1243631624945717248?ref_src=twsrc%5Etfw'>March 27, 2020</a></blockquote> <script async src='https://platform.twitter.com/widgets.js' charset='utf-8'></script>";
}

export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <WebView
        style={styles.card}
        onShouldStartLoadWithRequest={(request) => {
          console.log(request.url);
          return (
            request.url.includes("about:blank") ||
            request.url.startsWith("https://twitter.com/i/videos/tweet/") ||
            request.url.includes("/photo/")
          );
        }}
        source={{
          html: profileUrl("jackdblu"),
        }}
      />
    </View>
  );
}
