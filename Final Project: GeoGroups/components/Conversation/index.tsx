import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import PropTypes from 'prop-types';
import { useSelector } from "react-redux";
import { useFirebaseConnect, isLoaded, isEmpty } from "react-redux-firebase";

import ImagePicker from "../ImagePicker";
import ChatMessage from "../ChatMessage";
import InputBox from "../InputBox";
import { ConversationProps } from "../../types";
import {
  uploadImageAsync,
  downloadImageAsync,
  firebaseSendMessage,
} from "../../firebase/helpers";
import styles from "./styles"


/*
  type NewMessage = {
    message?: string;
    imageUri?: string;
    name: string;
    userId: string;
    createdAt: number;
    avatarUri: string | null;
  };

  type ConversationProps = {
    id: string;
    title: string;
    messagesData: {key: string; value: NewMessage}[];
    membersData: {key: string; value: boolean}[];
  };
*/

Conversation.PropTypess = {
  id: PropTypes.string,
  title: PropTypes.string,
  messagesData:PropTypes.array,
  membersData:PropTypes.array,
};

function Conversation(props: ConversationProps): JSX.Element {
  const user = useSelector(state => state.user)
  const {name, uid, avatarUri} = user
  let messages = null;
  const {id, title, messagesData, membersData} = props

  const sendTextMessage = (message: string): void => {
    const members = membersData.map(member => member.key)
    const createdAt = Date.now();
    const newMessage = {
        message,
        name,
        userId: uid,
        createdAt,
        avatarUri: avatarUri || null,
      }
    const lastMessage = {
        lastMessage: message,
        senderName: name,
        createdAt,
        chatTitle: title,
      }
    firebaseSendMessage(newMessage, lastMessage, members, id)
  }

  const sendImageMessageAsync = async (image: string): Promise<void> => {
    const members = membersData.map(member => member.key)
    const nameImage = String(Date.now())
    const path = `messages/${uid}/`
    await uploadImageAsync(path, nameImage, image)
    const imageUri  = await downloadImageAsync(path, nameImage)
    const createdAt = Date.now();
    const newMessage = {
        imageUri,
        name,
        userId: uid,
        createdAt,
        avatarUri: avatarUri || null,
      }
    const lastMessage = {
        isImage: true,
        senderName: name,
        createdAt,
        chatTitle: title,
      }
    firebaseSendMessage(newMessage, lastMessage, members, id)
  } 

  if (!isLoaded(messagesData) || !isLoaded(membersData) || isEmpty(membersData)) {
    return (
      <ImageBackground
        style={styles.containerLoading}
        source={require("../../assets/images/BG.png")}
      >
        <ActivityIndicator style={styles.activityIndicator} color="black" size="large"/>
      </ImageBackground>
    );
  }

  const renderItem = ({ item }):JSX.Element => <ChatMessage {...item} uid={uid} />

  if (!isEmpty(messagesData)) {
    messages = messagesData.map((message, index) => (
    {
      id: message.key, 
      text: message.value.message,  
      user: {
        userId: message.value.userId, 
        name: message.value.name,
        avatarUri: message.value.avatarUri,
      }, 
      imageUri: message.value.imageUri,
      createdAt: message.value.createdAt, 
    }))
    // add previous sender id
    messages = messages.map((message, index) => {
      let prevMessageUserId = ""
      if (index > 0) {
        prevMessageUserId = messages[index - 1].user.userId
      }
      return {...message, prevMessageUserId}
    }).reverse()
  }

  return (
    <ImageBackground
      style={styles.container}
      source={require("../../assets/images/BG.png")}
    >
      <FlatList keyExtractor={(item) => item.id} renderItem={renderItem} data={messages} inverted />
      <InputBox sendTextMessage={sendTextMessage} sendImageMessageAsync={sendImageMessageAsync}/>
    </ImageBackground>
  );
};

export default Conversation;
