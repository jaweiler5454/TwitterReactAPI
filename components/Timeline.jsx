import React, { Component } from "react";
import { Dimensions, View } from "react-native";
import { Icon } from "react-native-elements";
import Tweet from "./Tweet";
import data from "./data.json";

const colors = {
  twitter_blue: "#00acee",
  red: "#ff0000",
};

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

// MAIN CLASS
export default class Timeline extends Component {
  constructor(props) {
    super(props);
    this.myData = getData(props.username);
    this.isRetweet = false;
    this.hasMedia = false;
    this.mediaContent = null;
  }

  handleData(inputTweetObj) {
    let tweetObject = inputTweetObj;
    if (tweetObject.retweeted_status != null) {
      this.isRetweet = true;
      tweetObject = tweetObject.retweeted_status;
    }
    if (tweetObject.extended_entities != null) {
      this.hasMedia = true;
      this.mediaContent = getMediaContent(tweetObject);
    }
    return tweetObject;
  }

  render() {
    return (
      <View>
        {this.myData.map((tweet) => {
          return (
            <Tweet
              tweetObject={this.handleData(tweet)}
              isRetweet={this.isRetweet}
              hasMedia={this.hasMedia}
              mediaContent={this.mediaContent}
              name={tweet.user.name}
              username={tweet.user.screen_name}
            />
          );
        })}
      </View>
    );
  }
}

// Timeline.propTypes = {
//   username: PropTypes.string.isRequired,
// };
