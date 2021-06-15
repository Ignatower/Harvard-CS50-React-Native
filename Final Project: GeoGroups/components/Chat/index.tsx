import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableWithoutFeedback } from "react-native";
import PropTypes from 'prop-types';
import {
  MenuContext,
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import {
  useFirebaseConnect,
  isLoaded,
  isEmpty,
} from "react-redux-firebase";
import moment from "moment";
import { FontAwesome } from "@expo/vector-icons";
import {Image as ImageCache} from "react-native-expo-image-cache";


import { ChatProps } from "../../types";
import { leaveGroup } from "../../redux/actions";
import { firebaseLeaveGroup } from "../../firebase/helpers";
import styles from "./styles";


/*
  type ChatProps = {
    id: string;
    chatTitle: string;
    senderName: string;
    lastMessage: string;
    createdAt: number;
    // id of current user (not necessarily the sender)
    uid: string;
  }
*/

Chat.propTypes = {
  id: PropTypes.string,
  chatTitle: PropTypes.string,
  senderName: PropTypes.string,
  lastMessage: PropTypes.string,
  createdAt: PropTypes.number,
  uid: PropTypes.string,
  }

function Chat(props: ChatProps): JSX.Element {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { id, chatTitle, senderName, lastMessage, createdAt, uid } = props;
  const group = useSelector(({ firebase: { data } }) => data.groups && data.groups[id])
  useFirebaseConnect([`groups/${id}`]);

  const navigateToChat = (): void => {
    navigation.navigate("Chat", {
      id: id,
      title: chatTitle,
    });
  };

  const leaveTheGroup = (): void => {
    dispatch(leaveGroup(id))
    firebaseLeaveGroup(id, group.membersCount, uid)
  }

  const formatSenderName = (senderName: string): string => {
    // if chat has no messages
    if (!senderName) {
      return ''
    }
    if (senderName.length > 10) {
      return senderName.substring(0,10) + '...' + ' : '
    }
    return senderName + ': '
  }

  if (!group) {
    return <View style={styles.chatContainer}/>
  }
  
  const sender = formatSenderName(senderName)

  return (
    <View style={styles.chatContainer}>
      <Menu>
        <MenuTrigger onAlternativeAction={navigateToChat} triggerOnLongPress >
          <View style={styles.container}>
            <View style={styles.lefContainer}>
              {group.avatarUri && <ImageCache 
                {...{uri: group.avatarUri}} 
                style={styles.avatar} />}
              {!group.avatarUri && <Image
                source={require("../../assets/images/icon_group.png")}
                style={styles.avatar}
              />}

              <View style={styles.titleContainer}>
                <Text style={styles.title}>{chatTitle}</Text>
                {!sender && <Text>no messages yet</Text>}
                {(sender !== '') && lastMessage &&
                  <Text numberOfLines={1} ellipsizeMode="tail" style={styles.lastMessage}>
                    {sender + lastMessage}
                  </Text>
                }
                {(sender !== '') && !lastMessage && 
                  <View style={styles.senderName}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.lastMessage}>
                      {sender}
                    </Text>
                    <FontAwesome name="image" size={22}/>
                  </View>
                }
              </View>
            </View>

            <View style={styles.rigContainer}>
              <Text style={styles.time}>
                 {createdAt && moment(createdAt).format("DD/MM/YY")}
              </Text>

            </View>
          </View>
        </MenuTrigger>
        <MenuOptions>
          <MenuOption onSelect={leaveTheGroup} text='Leave Group' />
          <MenuOption onSelect={() => navigation.navigate('Map', {coords: group.coords, title: group.title})} text='Map' />
        </MenuOptions>
      </Menu>
    </View>
  );
};

const shouldNotUpdateComponentIf = (prevProps: ChatProps, nextProps: ChatProps): boolean =>
  prevProps.createdAt === nextProps.createdAt;

export default React.memo(Chat, shouldNotUpdateComponentIf);
