import React, { useState } from "react";
import {
  Text,
  View,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

import { ZOOM_COEFFICIENT } from "../constants/Values";


function AddLocationScreen({navigation, route}): JSX.Element {
  const user = useSelector(state => state.user)
  const [markerCoords, setMarkerCoords] = useState(user.location);

  const saveLocationAsync = async (): Promise<void> => {
    const location = markerCoords;
    const place = await Location.reverseGeocodeAsync(location);
    navigation.navigate({
      name: 'CreateGroup',
      params: {
        location,
        place,
      },
    })
  };

  if (!markerCoords)
    return (
      <View style={styles.gettingLocationScreen}>
        <ActivityIndicator color="black" size="large" />
        <Text style={styles.gettingLocationText}>Getting your location...</Text>
      </View>
    );

  const initialRegion = {
    latitude: markerCoords.latitude,
    longitude: markerCoords.longitude,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };
  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        <Marker.Animated
          draggable
          coordinate={markerCoords}
          onDragEnd={(e) =>
            setMarkerCoords(e.nativeEvent.coordinate)
          }
          title="You are here!"
          pinColor="red"
        />
      </MapView>
      <View style={styles.button}>
        <Button title="Save" onPress={saveLocationAsync} />
      </View>
    </View>
  ); 
}

export default AddLocationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 4,
  },
  gettingLocationScreen: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  gettingLocationText: {
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
