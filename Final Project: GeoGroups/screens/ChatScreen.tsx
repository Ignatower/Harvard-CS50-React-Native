import React from "react";
import {
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import { useFirebaseConnect, isLoaded, isEmpty } from "react-redux-firebase";

import Conversation from "../components/Conversation"


function ChatScreen({ route }): JSX.Element {
  const {id, title} = route.params;
  let messages = null;
  useFirebaseConnect([`messages/${id}`, `members/${id}`]);
  const messagesData = useSelector(({firebase: { ordered: { messages } } }) => messages && messages[id]);
  const membersData = useSelector(({firebase: { ordered: { members } } }) => members && members[id]);

  if (!isLoaded(messagesData) || !isLoaded(membersData) || isEmpty(membersData)) {
    return (
      <ImageBackground
        style={styles.containerLoading}
        source={require("../assets/images/BG.png")}
      >
        <ActivityIndicator style={styles.activityIndicator} color="black" size="large"/>
      </ImageBackground>
    );
  }
  return (
      <Conversation 
        id={id}
        title={title} 
        messagesData={messagesData} 
        membersData={membersData} 
      />
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  containerLoading: { 
    flex: 1, 
    width: "100%", 
    height: "100%", 
    justifyContent: 'center', 
  },
  activityIndicator: {
    alignSelf: 'center'
  },
});
