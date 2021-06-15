import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import PropTypes from 'prop-types';
import {
  MenuContext,
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import {
  useFirebase,
  useFirebaseConnect,
  isLoaded,
  isEmpty,
} from "react-redux-firebase";
import moment from "moment";
import {Image as ImageCache} from "react-native-expo-image-cache";

import { GroupProps } from "../../types";
import { joinGroup } from "../../redux/actions";
import { firebaseJoinToGroup } from "../../firebase/helpers";
import styles from "./styles";


/*
  type Coords = {
    latitude: number;
    longitude: number;
    radius: number;
  }

  type GroupProps = {
    id: string;
    title: string;
    coords: Coords;
    membersCount: number;
    avatarUri: string;
    place: string;
    distance: number;
  }
*/

Group.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    coords: PropTypes.object,
    membersCount: PropTypes.number,
    avatarUri: PropTypes.string,
    place: PropTypes.string,
    distance: PropTypes.number,
  }

function Group(props: GroupProps): JSX.Element {
  const user = useSelector(state => state.user);
  const uid = user.uid
  const navigation = useNavigation()
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const { id, title, coords, distance, membersCount, avatarUri } = props;
  const lastMessage = useSelector(({ firebase: { data } }) => data.lastMessages && data.lastMessages[id])

  useFirebaseConnect([`lastMessages/${id}`]);

  let distanceFromUser = ''
  if (distance < 1000) {
    distanceFromUser = String(distance) + ' m'
  } else {
    distanceFromUser = String(Math.floor(distance/1000)) + ' km'
  } 

  const joinToGroup = (): void => {
    dispatch(joinGroup(id))
    firebaseJoinToGroup(id, uid, membersCount, title, lastMessage)
  }

  return (
    <View style={styles.container}>
      <Menu>
        <MenuTrigger triggerOnLongPress>
          <View style={styles.lefContainer}>
            {avatarUri && <ImageCache {...{uri: avatarUri}} style={styles.avatar} />}
            {!avatarUri && <Image
              source={require("../../assets/images/icon_group.png")}
              style={styles.avatar}
            />}
            <View style={styles.midContainer}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.info}>
                {distanceFromUser}, {membersCount} members
              </Text>
            </View>
          </View>
        </MenuTrigger>
        <MenuOptions>
          <MenuOption onSelect={() => joinToGroup()} text='Join!' />
        </MenuOptions>
      </Menu>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Map', {title, coords})
        }}
        style={styles.rigContainer}
      >
        <Image
          source={require("../../assets/images/icon_map.png")}
          style={styles.map}
        />
      </TouchableOpacity>
    </View>
  );
};

const shouldNotUpdateComponentIf = (prevProps: GroupProps, nextProps: GroupProps): boolean =>
  prevProps.membersCount === nextProps.membersCount;

export default React.memo(Group, shouldNotUpdateComponentIf);
