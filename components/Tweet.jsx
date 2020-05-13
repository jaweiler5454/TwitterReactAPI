import React, { Component } from "react";
import { StyleSheet, View, Dimensions, Text } from "react-native";
import { Card, ListItem, Image, Icon, Overlay } from "react-native-elements";
import { Video } from "expo-av";
import FBCollage from "react-native-fb-collage";
import data from "./data.json";

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
    flex: 1,
  },
  imageContainer: {
    paddingLeft: "7.5%",
    paddingTop: "5%",
    borderRadius: 25,
    borderColor: colors.twitter_blue,
    width: DEVICE_WIDTH * 0.85,
    height: 0.25 * DEVICE_HEIGHT,
    flexDirection: "row",
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

function getMediaContent(tweet) {
  let i = 0;
  const mediaArray = tweet.extended_entities.media;
  const displayUrls = [];
  const types = [];
  const showUrls = [];
  const outputArray = [];
  for (i = 0; i < mediaArray.length; i += 1) {
    displayUrls.push(mediaArray[i].media_url_https);
    types.push(mediaArray[i].type);
    if (
      mediaArray[i].type === "video" ||
      mediaArray[i].type === "animated_gif"
    ) {
      showUrls.push(mediaArray[i].video_info.variants[0].url);
    } else {
      showUrls.push(displayUrls[i]);
    }
  }
  outputArray.push(displayUrls);
  outputArray.push(types);
  outputArray.push(showUrls);
  return outputArray;
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

// On PopUp
function modalContent(mediaType, mediaUrl) {
  if (mediaType === "video" || mediaType === "animated_gif") {
    return (
      <Video
        source={{
          uri: mediaUrl,
        }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode="cover"
        shouldPlay
        isLooping
        style={{ width: 300, height: 300 }}
      />
    );
  }
  return (
    <Image
      source={{
        uri: mediaUrl,
      }}
      resizeMode="contain"
      containerStyle={{
        width: DEVICE_WIDTH * 0.95,
        height: DEVICE_HEIGHT,
        paddingRight: "5%",
      }}
    />
  );
}

// if tweet is text only
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
export default class Tweet extends Component {
  constructor(props) {
    super(props);
    this.myData = getData(props.username);
    this.state = {
      showPhotoModal: false,
      currUrl: "",
      currMediaType: "",
    };
  }

  //   createTweetObject(tweetObj){
  //     if(tweetObj.extended_entities == null){

  //     }
  //   }

  render() {
    const { showPhotoModal } = this.state;
    const { currUrl } = this.state;
    const { currMediaType } = this.state;
    const media = getMediaContent(this.myData[2]);

    if (this.myData[3].text == null) {
      return createTextTweet(this.myData[2].text);
    }
    return (
      <View>
        <Overlay
          isVisible={showPhotoModal}
          overlayBackgroundColor="#ffffff"
          fullScreen
          overlayStyle={{ backgroundColor: "rgba(255,255,255,0.9)" }}
        >
          <View>
            <Icon
              onPress={() => {
                this.setState({ showPhotoModal: false });
              }}
              name="times-circle"
              type="font-awesome"
              color={colors.twitter_blue}
            />
            {modalContent(currMediaType, currUrl)}
          </View>
        </Overlay>
        <Card containerStyle={styles.card}>
          <View style={styles.cardHeader}>
            <ListItem
              containerStyle={{ paddingLeft: 0 }}
              roundAvatar
              title="@jackdblu"
              subtitle={dateDisplay(this.myData[2].created_at)}
              leftAvatar={{
                source: { uri: this.myData[2].user.profile_image_url_https },
              }}
              rightIcon={twitterIcon}
            />
          </View>
          <Text style={styles.text}>{parseMediaText(this.myData[2].text)}</Text>
          <View style={styles.imageContainer}>
            <FBCollage
              images={media[0]}
              style={styles.singleImage}
              imageOnPress={(index, images) => {
                this.setState({
                  showPhotoModal: true,
                  currUrl: media[2][index],
                  currMediaType: media[1][index],
                });
              }}
            />
          </View>
        </Card>
      </View>
    );
  }
}

// Timeline.propTypes = {
//   username: PropTypes.string.isRequired,
// };
