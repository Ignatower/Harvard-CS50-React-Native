import React from "react";
import { Text, View } from "react-native";
import PropTypes from 'prop-types';
import moment from "moment";
import { Image as ImageCache } from "react-native-expo-image-cache";

import { ChatMessageProps } from "../../types";
import styles from "./styles";
 

/*
  type ChatMessageProps = {
    id: string;
    text: string;
    // the user that sent the message
    user: {
      name: string;
      userId: string;
      avatarUri: string
    };
    imageUri: string;
    createdAt: number;
    // the id of the current user of the app
    uid:  string;
    // the id of the sender of the previous message
    prevMessageUserId: string,
  };
*/

ChatMessage.propTypes = {
    id: PropTypes.string,
    text: PropTypes.string,
    user: PropTypes.object,
    imageUri: PropTypes.string,
    createdAt: PropTypes.number,
    uid:  PropTypes.string,
    prevMessageUserId: PropTypes.string,
  }

function ChatMessage(props: ChatMessageProps): JSX.Element {
  const { id, text, user, imageUri, createdAt, uid, prevMessageUserId} = props;

  // check if the sender is the current user
  const isMyMessage = (): boolean => user.userId === uid

  // check if is the sender also sent the previous message
  const isSameSender = (): boolean => user.userId === prevMessageUserId

  // function that changes the color of the users names in the chat
  const getUserNameColor = (username: string): string => {
    let sumChars = 0;
    for(let i = 0;i < username.length;i++){
      sumChars += username.charCodeAt(i);
    }
    const colors = [
      '#e67e22', // carrot
      '#2ecc71', // emerald
      '#3498db', // peter river
      '#8e44ad', // wisteria
      '#e74c3c', // alizarin
      '#1abc9c', // turquoise
      '#2c3e50', // midnight blue
    ];
    return colors[sumChars % colors.length];
  }

  if (!imageUri) {
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.messageBox,
            {
              backgroundColor: isMyMessage() ? "#DCF8C5" : "white",
              marginLeft: isMyMessage() ? 50 : 0,
              marginRight: isMyMessage() ? 0 : 50,
            },
          ]}
        >
          {!isMyMessage() && !isSameSender() && 
            <Text style={[styles.name, {color: getUserNameColor(user.name)}]}>
              {user.name}
            </Text>
          }
          <Text>{text}</Text>
          <Text style={styles.time}>{moment(createdAt).format('h:mm a')}</Text>
        </View>
      </View>
    ); 
  }
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.imageBox,
          {
            backgroundColor: isMyMessage() ? "#DCF8C5" : "white",
            marginLeft: isMyMessage() ? 126 : 0,
            marginRight: isMyMessage() ? 0 : 126,
            alignItems: isMyMessage() ? 'flex-end' : 'flex-start',
          },
        ]}
      >
        {!isMyMessage() && !isSameSender() && (
          <Text
            style={[
              styles.name,
              { color: getUserNameColor(user.name), marginLeft: 2 },
            ]}
          >
            {user.name}
          </Text>
        )}
        <ImageCache style={styles.image} {...{uri: imageUri}} />
        <Text style={styles.time}>{moment(createdAt).format('h:mm a')}</Text>
      </View>
    </View>
  ); 
};

const shouldNotUpdateComponentIf = (
  prevProps: ChatMessageProps,
  nextProps: ChatMessageProps
): boolean => prevProps.createdAt === nextProps.createdAt;

export default React.memo(ChatMessage, shouldNotUpdateComponentIf);
