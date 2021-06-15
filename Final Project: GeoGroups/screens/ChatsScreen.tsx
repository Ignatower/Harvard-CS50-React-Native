import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  useNavigation,
  useIsFocused,
  useFocusEffect,
} from "@react-navigation/native";
import { useBackHandler } from "@react-native-community/hooks";
import { useFirebaseConnect, isLoaded, isEmpty } from "react-redux-firebase";

import firebase from "../firebase/config";
import { Text, View } from "../components/Themed";
import Chat from "../components/Chat";
import { resetUser } from "../redux/actions";


function ChatsScreen(): JSX.Element {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const user = useSelector(state => state.user)
  const { uid } = user
  const dispatch = useDispatch()
  const chatsData = useSelector(({firebase: { ordered: { chats } } }) => chats && chats[uid])

  useFirebaseConnect([{path: `chats/${uid}`, queryParams: ['orderByChild=createdAt']}]);

  // disable goback to Login
  useBackHandler(() => isFocused)

  // reset user after unmount screen (i.e. unmount screen from stack of stack navigator)
  // this happens after Logout
  useEffect(() => () => {
      dispatch(resetUser())
    },[])


  if (!isLoaded(chatsData) || isEmpty(chatsData)) {
    return <View style={styles.screen} />;
  }
  
  const chats = chatsData.map((chat) => ({id: chat.key, ...chat.value})).reverse()

  const renderItem = ({ item }): JSX.Element => <Chat {...item} uid={uid} />;

  return (
    <View style={styles.screen}>
      <FlatList
        renderItem={renderItem}
        data={chats}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

export default ChatsScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    margin: 2,
  },
});
