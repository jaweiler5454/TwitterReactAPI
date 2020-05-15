import React, { Component } from "react";
import { StyleSheet, View, Dimensions, Text } from "react-native";
import { Card, ListItem, Image, Icon, Overlay } from "react-native-elements";
import { Video } from "expo-av";
import FBCollage from "react-native-fb-collage";
import PropTypes from "prop-types";
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
    paddingTop: "0%",
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
  retweetComponent: {
    fontSize: 14,
    paddingLeft: "5%",
    paddingTop: "2%",
    paddingBottom: "0%",
  },
});

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
 * parseMediaText takes the text of a tweet returns the text without the media url at the end of the tweet and no RT tag
 * if this tweet's texts includes either of those things
 * @param {String} text
 * @returns {String}
 */
function parseText(text, hasMedia) {
  const textLen = text.length;
  if (hasMedia) {
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
  return text;
}

// STATELESS COMPONENTS //

function retweetComponent(retweetStatus, user) {
  if (retweetStatus === true) {
    return (
      <Text style={styles.retweetComponent}>{user.concat(" retweeted")}</Text>
    );
  }
  return null;
}

// if tweet is text only
function textComponent(tweetObj, isRetweet, hasMedia, user, tweeter) {
  return (
    <View>
      {retweetComponent(isRetweet, user)}
      <View style={styles.cardHeader}>
        <ListItem
          containerStyle={{ paddingLeft: 0 }}
          roundAvatar
          title={"@".concat(tweeter)}
          subtitle={dateDisplay(tweetObj.created_at)}
          leftAvatar={{
            source: { uri: tweetObj.user.profile_image_url_https },
          }}
          rightIcon={twitterIcon}
        />
      </View>
      <Text style={styles.text}>{parseText(tweetObj.text, hasMedia)}</Text>
    </View>
  );
}

// function quotedComponent(tweetObject, isRetweet, hasMedia, user, tweeter){
//     return(
//         <Card>
//             <ListItem>

//             </ListItem>
//         </Card>
//     );
// }

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

// MAIN CLASS
export default class Tweet extends Component {
  constructor(props) {
    super(props);
    this.myData = data; // will delete

    this.name = props.name;
    this.username = props.username;
    this.tweet = props.tweetObject; // imported from timeline
    this.isRetweet = props.isRetweet; // NEED TO BE IMPORTED FROM TIMELINE
    this.hasMedia = props.hasMedia; // NEED TO BE IMPORTED FROM TIMELINE
    this.doesQuote = props.doesQuote;
    this.media = props.mediaContent;
    this.accountName = props.accountName;

    this.state = {
      showPhotoModal: false,
      currUrl: "",
      currMediaType: "",
    };
  }

  render() {
    // state assignments
    const { showPhotoModal } = this.state;
    const { currUrl } = this.state;
    const { currMediaType } = this.state;

    if (this.hasMedia === false) {
      return (
        <Card containerStyle={styles.card}>
          {textComponent(
            this.tweet,
            this.isRetweet,
            this.hasMedia,
            this.accountName,
            this.username
          )}
        </Card>
      );
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
          <View>
            {textComponent(
              this.tweet,
              this.isRetweet,
              this.hasMedia,
              this.accountName,
              this.username
            )}
            <View style={styles.imageContainer}>
              <FBCollage
                images={this.media[0]}
                style={styles.singleImage}
                imageOnPress={(index) => {
                  this.setState({
                    showPhotoModal: true,
                    currUrl: this.media[2][index],
                    currMediaType: this.media[1][index],
                  });
                }}
              />
            </View>
          </View>
        </Card>
      </View>
    );
  }
}

// PROPS VALIDATION
Tweet.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  tweetObject: PropTypes.object.isRequired,
  isRetweet: PropTypes.bool.isRequired,
  hasMedia: PropTypes.bool.isRequired,
  doesQuote: PropTypes.bool.isRequired,
  mediaContent: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
    .isRequired,
  name: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  accountName: PropTypes.string.isRequired,
};
