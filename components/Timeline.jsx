import React, { Component, PropTypes } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableHighlight,
  Button,
} from "react-native";
import {
  Card,
  ListItem,
  Image,
  Icon,
  Header,
  Overlay,
} from "react-native-elements";
import data from "./data";

// CLASS-WIDE CONSTANTS
const DEVICE_WIDTH = Math.round(Dimensions.get("window").width);
const DEVICE_HEIGHT = Math.round(Dimensions.get("window").height);

const colors = {
  twitter_blue: "#00acee",
  red: "#ff0000",
};

const twitterIcon = (
  <Icon name="twitter" type="font-awesome" color={colors.twitter_blue} />
);
const xIcon = (
  <Icon
    onPress={() => {
      this.state.showPhotoModal = false;
    }}
    name="times-circle"
    type="font-awesome"
    color={colors.twitter_blue}
  />
);

// RANDOM IMAGE CONSTANT FOR TESTING -- DELETE
const img = require("../JC.jpeg");

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "#f2f2f2",
  },
  card: {
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    flexDirection: "column",
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingTop: 0,
    paddingLeft: 0,
  },
  cardHeader: {
    paddingLeft: "5%",
  },
  singleImage: {
    width: DEVICE_WIDTH * 0.8,
    height: 0.25 * DEVICE_HEIGHT,
  },
  imageContainer: {
    paddingLeft: "7.5%",
    paddingTop: "5%",
    borderRadius: 100,
  },
  avatar: {
    flexDirection: "row",
    borderRadius: 100,
  },
  text: {
    fontSize: 18,
    paddingLeft: "5%",
  },
  mediaOverlay: {},
});

// NON-CLASS FUNCTIONS
function getData(username) {
  return data;
}

function mediaType(tweet) {
  if (tweet.entities.media == null) {
    return "textOnly";
  }
  if (tweet.entities.media.type === tweet.extended_entities.media.type) {
    return "photo";
  }
  return "text";
}

/**
 * dateDisplay accepts a date String in "raw" form -- what is given by Twitter API. EX: "Tue Nov 19 18:16:04 +0000 2019"
 * and returns a date String in standard form, EX: Mar 30 9:47 PM
 * @param {String} rawDate
 * @returns {String}
 */
function dateDisplay(rawDate) {
  const date = rawDate.substring(4, 10);
  let militaryTime = rawDate.substring(11, 16);
  const currHour = parseInt(militaryTime.substring(0, 2), 10);
  if (currHour <= 12) {
    militaryTime = militaryTime.concat(" AM");
  } else {
    militaryTime = (currHour - 12)
      .toString()
      .concat(militaryTime.substring(2))
      .concat(" PM");
  }
  return date.concat(" ").concat(militaryTime);
}

/**
 * parseMediaText takes the text of a tweet and returns the text without the media url at the end of the tweet
 * @param {String} text 
 * @returns {String}
 */
function parseMediaText(text) {
  const textLen = text.length;
  let returnIndex = textLen - 1;
  let i = textLen - 1;
  for (i = textLen - 1; i >= 4; i -= 1) {
    if (text.substring(i - 4, i + 1) === "https") {
      returnIndex = i - 4;
      break;
    }
  }
  return text.substring(0, returnIndex);
}

// COMPONENT Module FOR CLEANLINESS AND MODUALITY
function createTextTweet(tweet) {
  return (
    <Card containerStyle={styles.card}>
      <View style={styles.cardHeader}>
        <ListItem
          containerStyle={{ paddingLeft: 0 }}
          roundAvatar
          title="@jackdblu"
          subtitle={dateDisplay(tweet.created_at)}
          leftAvatar={{
            source: { uri: tweet.user.profile_image_url_https },
          }}
          rightIcon={twitterIcon}
        />
      </View>
      <View style={styles.cardItem}>
        <Text style={styles.text}>{tweet.text}</Text>
      </View>
    </Card>
  );
}

// MAIN CLASS
export default class Timeline extends Component {
  constructor(props) {
    super(props);
    this.myData = getData(props.username);
    this.state = {
      showPhotoModal: false,
    };
  }

  render() {
    if (mediaType(this.myData[3]) === "textOnly") {
      return createTextTweet(this.myData[0]);
    }
    if (mediaType(this.myData[3]) === "photo") {
      const { showPhotoModal } = this.state;
      return (
        <View>
          <Overlay
            isVisible={showPhotoModal}
            overlayBackgroundColor="#ffffff"
            fullScreen
            overlayStyle={{ backgroundColor: "rgba(255,255,255,0.9)" }}
          >
            <Icon
              onPress={() => {
                this.setState({ showPhotoModal: false });
              }}
              name="times-circle"
              type="font-awesome"
              color={colors.twitter_blue}
            />
            <Image
              source={{
                uri: this.myData[3].extended_entities.media[0].media_url_https,
              }}
              resizeMode="contain"
              containerStyle={{
                width: DEVICE_WIDTH * 0.95,
                height: DEVICE_HEIGHT,
                paddingRight: "5%",
              }}
            />
          </Overlay>
          <Card containerStyle={styles.card}>
            <View style={styles.cardHeader}>
              <ListItem
                containerStyle={{ paddingLeft: 0 }}
                roundAvatar
                title="@jackdblu"
                subtitle={dateDisplay(this.myData[3].created_at)}
                leftAvatar={{
                  source: { uri: this.myData[3].user.profile_image_url_https },
                }}
                rightIcon={twitterIcon}
              />
            </View>
            <Text style={styles.text}>
              {parseMediaText(this.myData[3].text)}
            </Text>
            <TouchableHighlight
              underlayColor="transparent"
              onPress={
                (console.log(showPhotoModal),
                () => this.setState({ showPhotoModal: true }))
              }
            >
              <View style={styles.imageContainer}>
                <Image
                  source={{
                    uri: this.myData[3].extended_entities.media[0]
                      .media_url_https,
                  }}
                  containerStyle={styles.singleImage}
                  resizeMode="cover"
                />
              </View>
            </TouchableHighlight>
          </Card>
        </View>
      );
    }
    return <View />;
  }
}

// Timeline.propTypes = {
//   username: PropTypes.string.isRequired,
// };
