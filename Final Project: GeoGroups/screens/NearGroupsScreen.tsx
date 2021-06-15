import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  View,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  useFirebase,
  useFirebaseConnect,
  isLoaded,
  isEmpty,
} from "react-redux-firebase";
import { useIsFocused } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";

import { updateUser } from "../redux/actions";
import GroupItem from "../components/Group";
import { GroupProps } from "../types";
import { EARTH_RADIUS } from "../constants/Values"


/* 
  type Coords = {
    latitude: number;
    longitude: number;
    radius: number;
  };

  type GroupProps = {
    id: string;
    title: string;
    coords: Coords;
    membersCount: number;
    avatarUri: string;
    place: string;
    distance: number;
  };
*/

function NearGroupScreen({ navigation }): JSX.Element {
  const [hasPermission, setHasPermission] = useState(true);
  const [locationSuscription, setLocationSuscription] = useState(null);
  const watchId = useRef() // ref to user location tracker
  const dispatch = useDispatch()
  useFirebaseConnect(["groups"]);
  const user = useSelector(state => state.user)
  const groupsJson = useSelector((state) => state.firebase.data.groups);

  useEffect(()=>{
    const requestLocationPermissionsAsync = async (): Promise<void> => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
          alert("Permission to access location was denied");
          setHasPermission(false);
      } else {
          setHasPermission(true);
      }
    }

    requestLocationPermissionsAsync();
  },[])


  useEffect(()=>{
    // track user location
    const trackLocationAsync = async (): Promise<void> => {
      watchId.current = await Location.watchPositionAsync(
        {
          accuracy: 3,
          timeInterval: 2000,
          distanceInterval: 100,
        },
        async (location) => {
          const userLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          dispatch(updateUser({location: userLocation}));
        }
      );
    };

    if (hasPermission === true) {
        trackLocationAsync();
    }

    // after unmount (i.e. logout) free user location tracker
    return (() => {
      if (hasPermission) {
        watchId.current.remove();
      }});
    
    },[]);

  // Converts numeric degrees to radians
  const toRad = (value: number): number => value * Math.PI / 180;

  // This function takes in latitude and longitude of two location and returns
  // the distance between them as the crow flies (in m)
  const distanceFromCoords = (lat1: number, lon1: number, lat2: number, lon2: number): number => { 
    const dLat = toRad(lat2-lat1);
    const dLon = toRad(lon2-lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return EARTH_RADIUS*c*1000;
  }

  // Converts groupsJson data, obtained from backend, to an Array of groups. 
  // And filter them by their distance from user. 
  const getGroups = (groupsJson, userLocation: {latitude: number, longitude: number}): GroupProps[] | undefined => {
    if (!groupsJson || !userLocation)
      return undefined;
    let groupsArr = Object.keys(groupsJson).map((key) => ({
      id: key,
      title: groupsJson[key].title,
      coords: groupsJson[key].coords,
      membersCount: groupsJson[key].membersCount,
      place: groupsJson[key].place,
      avatarUri: groupsJson[key].avatarUri,
    }));
    if (user.groups) {
      // filter if user is in group
      groupsArr = groupsArr.filter(group => !Object.keys(user.groups).includes(group.id))
      // filter far groups
      groupsArr = groupsArr.filter((group) => 
        distanceFromCoords(
          group.coords.latitude,
          group.coords.longitude,
          userLocation.latitude,
          userLocation.longitude
        ) <= group.coords.radius);
    }
    // add to groups the distance atribute
    groupsArr = groupsArr.map((group) => ({
      ...group, 
      distance: Math.floor(distanceFromCoords(
        group.coords.latitude,
        group.coords.longitude,
        userLocation.latitude,
        userLocation.longitude))
    }))
    return groupsArr
  };

  const groups = getGroups(groupsJson, user.location);

  const renderItem = ({ item }): JSX.Element => <GroupItem {...item} />;

  if (hasPermission === false)
    return <View style={styles.screen}/>
  if (!user.location)
    return (
      <View style={styles.gettingLocationScreen}>
        <ActivityIndicator color="black" size="large" />
        <Text style={styles.gettingLocationText}>Getting your location...</Text>
      </View>
    );
  if (!groups) {
    return (
      <View style={styles.screen}>
        <TouchableOpacity onPress={() => navigation.navigate('CreateGroup')} style={styles.buttonContainer}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="group-add" size={40} />
          </View>
          <Text style={styles.text}> Create a group </Text>
        </TouchableOpacity> 
      </View>
    );
  }
  return (
    <View style={styles.screen}>
      <TouchableOpacity onPress={() => navigation.navigate('CreateGroup')} style={styles.buttonContainer}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="group-add" size={60} />
        </View>
        <Text style={styles.text}> Create a group </Text>
      </TouchableOpacity> 
      <FlatList
        renderItem={renderItem}
        data={groups}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

export default NearGroupScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  gettingLocationScreen: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  gettingLocationText: {
    fontSize: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: "grey",
  },
  iconContainer: {
    flex: 1,
    marginLeft: 4,
    alignSelf: 'center',
  },
  text: {
    flex: 4,
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: 'center',
    justifyContent: 'center',
  },
});
