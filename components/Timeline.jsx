import React, { Component, useState, useEffect } from "react";
import { Dimensions, View, ScrollView, Text } from "react-native";
import { Icon } from "react-native-elements";
import Tweet from "./Tweet";
// import data from "./data.json";

const colors = {
  twitter_blue: "#00acee",
  red: "#ff0000",
};

// NON-CLASS FUNCTIONS

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

    // PROP assignment
    this.username = props.username;
    this.userId = props.userId;

    this.isRetweet = false;
    this.hasMedia = false;
    this.mediaContent = null;
    this.doesQuote = false;

    this.state = {
      loading: true,
      myData: [],
    };
  }

  componentDidMount() {
    const myHeaders = new Headers();

    myHeaders.append(
      "Authorization",
      'OAuth oauth_consumer_key="w6MdB0mSsgiQ22CONyYAUi1Z0",oauth_token="1245097391071670280-zzdVEGFOrFFMZSPZYT0SwIaHBYDi9k",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1589550823",oauth_nonce="TO4TF3eLISX",oauth_version="1.0",oauth_signature="gtQrD3twpoCXk93sd6may5FviCk%3D"'
    );
    myHeaders.append(
      "Cookie",
      'personalization_id="v1_n/xvi4yIru6+0thMSCA+EQ=="; guest_id=v1%3A158569619909156784; lang=en'
    );

    const endpoint = "https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=".concat(
      this.userId
    );

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const fetchData = async () => {
      await fetch(endpoint, requestOptions)
        .then((res) => res.json())
        .then((json) => {
          this.setState({
            loading: false,
            myData: json,
          });
          return json;
        })
        .catch((error) => console.log("error", error));
    };
    fetchData();
  }

  handleData(inputTweetObj) {
    let tweetObject = inputTweetObj;
    // initialize objects
    this.mediaContent = Array(3);
    this.hasMedia = false;
    this.doesQuote = false;
    if (tweetObject.retweeted_status != null) {
      this.isRetweet = true;
      tweetObject = tweetObject.retweeted_status;
    }
    if (tweetObject.extended_entities != null) {
      this.hasMedia = true;
      this.mediaContent = getMediaContent(tweetObject);
    }
    if (tweetObject.quoted_status != null) {
      this.doesQuote = true;
    }
    return tweetObject;
  }

  render() {
    const { loading } = this.state;
    if (loading) {
      return <Text>Loading...</Text>;
    }
    const { myData } = this.state;
    return (
      <ScrollView>
        {myData.map((tweet) => {
          const inputTweet = this.handleData(tweet);
          return (
            <Tweet
              tweetObject={inputTweet}
              isRetweet={this.isRetweet}
              hasMedia={this.hasMedia}
              mediaContent={this.mediaContent}
              doesQuote={this.doesQuote}
              name={inputTweet.user.name}
              username={inputTweet.user.screen_name}
              accountName={this.username}
            />
          );
        })}
      </ScrollView>
    );
  }
}

// Timeline.propTypes = {
//   username: PropTypes.string.isRequired,
// };
