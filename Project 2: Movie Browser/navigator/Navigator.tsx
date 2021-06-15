import React from "react";
import { View, StyleSheet } from "react-native";
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import DetailScreen from "../screens/DetailScreen";
import { TabParamList, RootStackParamList } from "../types";

function getHeaderTitle(route): string {
  const headerTitle: string = getFocusedRouteNameFromRoute(route) ?? "Home";
  return headerTitle;
}

const Tab = createMaterialBottomTabNavigator<TabParamList>();

const TabNavigator = () => (
  <Tab.Navigator
    activeColor="red"
    labelStyle={{ fontSize: 12 }}
    screenOptions={{ backgroundColor: "black" }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarLabel: "Home",
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="home" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarLabel: "Profile",
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="account" color={color} size={26} />
        ),
      }}
    />
  </Tab.Navigator>
);

const TabScreen = (): JSX.Element => (
  <View style={styles.screen}>
    <TabNavigator />
  </View>
);

const Stack = createStackNavigator<RootStackParamList>();

const MyTheme = {
  dark: true,
  colors: {
    primary: "yellow",
    background: "rgb(40, 40, 40)",
    card: "black",
    text: "white",
    border: "pink",
    notification: "orange",
  },
};

const Navigator = () => (
  <NavigationContainer theme={MyTheme}>
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: {
          backgroundColor: "black",
        },
        headerTintColor: "red",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
        name="Tab"
        component={TabScreen}
        options={({ route }) => ({
          headerTitle: getHeaderTitle(route),
          headerLeft: () => null,
        })}
      />
      <Stack.Screen name="Details" component={DetailScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default Navigator;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
  },
  label: {
    textAlign: "center",
  },
});
