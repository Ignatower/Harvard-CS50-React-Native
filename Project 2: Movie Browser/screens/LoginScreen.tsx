import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-elements";

const LoginScreen = ({ navigation }): JSX.Element => (
  <View style={styles.screen}>
    <Button
      title="Login"
      onPress={() => {
        navigation.navigate("Tab");
      }}
    />
  </View>
);

export default LoginScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
