import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Avatar, Button } from "react-native-elements";

const ProfileScreen = ({ navigation }): JSX.Element => (
  <View style={styles.screen}>
    <View style={styles.header}>
      <View style={styles.column}>
        <Avatar
          size="large"
          rounded
          icon={{ name: "rocket", color: "darkgrey", type: "font-awesome" }}
          overlayContainerStyle={{ backgroundColor: "indigo" }}
          containerStyle={styles.avatar}
        />
      </View>
      <View style={styles.column}>
        <Text style={styles.title}> Paul! </Text>
      </View>
      <View style={styles.column} />
    </View>

    <View style={styles.body}>
      <Text style={styles.textProfile}> Mail: paul@thebeatles.com </Text>
      <Text style={styles.textProfile}> Password: ******** </Text>
    </View>

    <View style={styles.buttonContainer}>
      <Button
        title="Logout"
        onPress={() => {
          navigation.navigate("Login");
        }}
      />
    </View>
  </View>
);

export default ProfileScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginTop: 2,
  },
  header: {
    flex: 2,
    flexDirection: "row",
    backgroundColor: "rgb(40, 40, 40)",
  },
  body: {
    flex: 6,
    justifyContent: "space-around",
    marginLeft: 20,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
  column: {
    flex: 1,
    alignSelf: "center",
  },
  avatar: {
    margin: 4,
  },
  title: {
    textAlign: "center",
    alignSelf: "center",
    fontSize: 30,
    color: "white",
  },
  textProfile: {
    fontSize: 20,
    color: "white",
  },
});
