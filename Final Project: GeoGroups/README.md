# Final Project: Self-Designed App

## GeoGroups

<p align="center" >
<p align="center" >
    <img alt="geo-groups" src="https://github.com/Ignatower/Harvard-CS50-React-Native/tree/main/Final%20Project:%20GeoGroups/geogroups.gif" width="260" height="510" />
 </a>
</p>
</p>


## Objectives

    Implement a project with JavaScript and React Native from scratch.
    Develop a workflow for developing mobile apps.
    Design your own interfaces.

## Requirements

- `Must use redux`
- `Must make at least one network call`
- `Must have at least one stack navigator`
- `Must have at least one tab navigator`
- `Must be at least as large in scope as the previous projects`

## Installation

```
$ yarn install
$ expo start
```

## Solution

If you want to use the app without installing the code, the app is available (only for Android) at
https://expo.io/@ignatower/geogroups

## Description of the App

    The app is called Geogroups and it is a geolocation chat app. The idea is to have groups of chats
    of people nearby. Each group has a location circle given by a center and a radius, only users
    whose location is within the surface of the circle can join. Images and text can be sent in
    chats. Each user has a profile consisting of a photo and a name. Authentication is via email
    and password. The backend used is Firebase

## Toolbox Of This Project

- [react-navigation](https://reactnavigation.org/) `(Used to Routing and navigations)`
- [react-native-maps](https://github.com/react-native-maps/react-native-maps) `(Used for maps)`
- [react-native-expo-image-cache](https://github.com/wcandillon/react-native-expo-image-cache) `(Used to optimize the rendering of images in chats)`
- [react-native-popup-menu](https://github.com/instea/react-native-popup-menu/) `(Used to make some popup menus)`
- [react-native-keyboard-aware-scroll-view](https://github.com/APSL/react-native-keyboard-aware-scroll-view) `(Used to handle keyboard in a complex Form)`
- [expo-location](https://docs.expo.io/versions/latest/sdk/location/) `(Used to track user location and handle location in maps)`
- [expo-image-picker](https://docs.expo.io/versions/latest/sdk/imagepicker/) `(Used to select images from the file system)`
- [expo firebase](https://docs.expo.io/guides/using-firebase/) `(Used Firebase Backend)`
- [redux](https://redux.js.org/) `(Used to store firebase data, current user data and their location)`
- [react-redux](https://react-redux.js.org/) `(Used to use some redux funcitons via hooks)`
- [react-redux-firebase](http://react-redux-firebase.com/) `(Used to get the data from Firebase Backend)`

