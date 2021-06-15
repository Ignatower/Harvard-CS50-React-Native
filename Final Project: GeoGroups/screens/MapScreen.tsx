import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import MapView from "react-native-maps";
import * as Location from "expo-location";

import { ZOOM_COEFFICIENT } from "../constants/Values";


function MapScreen({ route }): JSX.Element {
  const {coords, title} = route.params
  const user = useSelector(state => state.user)
  const {latitude, longitude, radius} = coords
  const center = {latitude, longitude}
  const [showGroupCircle, setShowGroupCircle] = useState(false)
  const [region, setRegion] = useState({
    latitude,
    longitude,
    latitudeDelta: radius * ZOOM_COEFFICIENT,
    longitudeDelta: radius * ZOOM_COEFFICIENT
  })

  // show or hide in the map the group circle surface
  const toggleGroupCircle = (): void => {
    setShowGroupCircle(!showGroupCircle)
  };

  // go to user region in map
  const goToUserRegion = (): void => {
    const region = {
      latitude: user.location.latitude,
      longitude: user.location.longitude,
      latitudeDelta: radius * ZOOM_COEFFICIENT,
      longitudeDelta: radius * ZOOM_COEFFICIENT,
    };
    setRegion(region);
  };

    if (!user.location) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator color="black" size="large" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      );
    }
    return (
      <View style={styles.screen}>
        <MapView style={styles.map} region={region}>
          <MapView.Marker
            coordinate={user.location}
            title="You are here!"
            pinColor="blue"
          >
            <Image
              source={require("../assets/images/icon_user.png")}
              style={styles.tinyLogo}
            />
          </MapView.Marker>
          <MapView.Marker
            coordinate={center}
            title={title}
            onPress={toggleGroupCircle}
          >
            <Image
              source={require("../assets/images/icon_group.png")}
              style={styles.tinyLogo}
            />
          </MapView.Marker>
          {showGroupCircle && (
            <MapView.Circle
              center={center}
              radius={radius}
              strokeColor="red"
              fillColor="pink"
            />
          )}
        </MapView>
        <View style={styles.button}>
          <Button title="Go to user region" onPress={goToUserRegion} />
        </View>
      </View>
    );
}

export default MapScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 2,
  },
    loading: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 20,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  button: {
    position: "absolute",
    top: "90%",
    alignSelf: "center",
  },
  tinyLogo: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});
