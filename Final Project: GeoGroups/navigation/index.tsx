/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import React from "react";
import {
  ColorSchemeName,
  View,
  TouchableOpacity,
} from "react-native";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StackActions } from "@react-navigation/native";
import {
  Ionicons,
} from "@expo/vector-icons";

import ChatScreen from "../screens/ChatScreen";
import MapScreen from "../screens/MapScreen";
import AddLocationScreen from "../screens/AddLocationScreen";
import LoginScreen from "../screens/LoginScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ChangeNameScreen from "../screens/ChangeNameScreen";
import CreateGroupScreen from "../screens/CreateGroupScreen";
import { RootStackParamList } from "../types";
import TopTabNavigator from "./TopTabNavigator";
import Colors from "../constants/Colors";

export default function Navigation({colorScheme}: { colorScheme: ColorSchemeName}) {
  return (
    <NavigationContainer
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.light.tint,
          shadowOpacity: 0,
          elevation: 0,
        },
        headerTintColor: Colors.light.background,
        headerTitleAlign: "left",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{header: () => null,}}
      />
      <Stack.Screen
        name="Root"
        component={TopTabNavigator}
        options={({ navigation }) => ({
          title: "GeoGroups",
          headerRight: () => (
            <View
              style={{
                flexDirection: "row",
                width: 60,
                justifyContent: "flex-end",
                marginRight: 10,
              }}
            >
              <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                  <Ionicons
                    name="settings-outline"
                    size={22}
                    color={"white"}
                  />
              </TouchableOpacity>
            </View>
          ),
          headerLeft : () => null,
        })}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route }) => ({
          title: route.params.title,
        })}
      />
      <Stack.Screen
        name="Map"
        component={MapScreen}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
      />      
      <Stack.Screen
        name="ChangeName"
        component={ChangeNameScreen}
        options={{title: "User Name"}}
      />
      <Stack.Screen
        name="CreateGroup"
        component={CreateGroupScreen}
      />
      <Stack.Screen
        name="AddLocation"
        component={AddLocationScreen}
      />
    </Stack.Navigator>
  );
}
