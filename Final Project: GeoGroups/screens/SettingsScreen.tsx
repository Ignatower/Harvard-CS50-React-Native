import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  AntDesign,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { StackActions } from "@react-navigation/native";

import firebase from "../firebase/config";
import {
  uploadImageAsync,
  downloadImageAsync,
  firebaseChangeUserAvatar,
} from "../firebase/helpers";
import { updateUser } from "../redux/actions";
import ImagePicker from "../components/ImagePicker";


function SettingsScreen({ navigation }): JSX.Element {
  const [loading, setLoading] = useState(false)
  const user = useSelector(state => state.user)
  const { uid } = user
  const dispatch = useDispatch()

  const logoutAsync = async (): Promise<void> => {
    try {
      await firebase.auth().signOut();
      // reset stack navigation
      navigation.dispatch(StackActions.popToTop())
    } catch (error) {
      alert(error);
    }
  }

  const changeUserAvatarAsync = async (image): Promise<void> => {
    setLoading(true)
    const imageUri = image.uri
    const name = String(Date.now())
    const path = `users/${uid}/`
    await uploadImageAsync(path, name, imageUri)
    const avatarUri  = await downloadImageAsync(path, name)
    if (avatarUri) {
      firebaseChangeUserAvatar(uid, avatarUri)
      dispatch(updateUser({avatarUri: avatarUri}))
    }
    setLoading(false)
  }

  return (
    <View style={styles.screen}>
      <View style={styles.containerTop}>
        <View style={styles.containerTopLef}/>
        <View style={styles.containerTopMid}>
          {!loading && !user.avatarUri && <Image
              source={require("../assets/images/icon_user.png")}
              style={styles.avatar}
          />}
        {!loading && user.avatarUri && <Image source={{ uri: user.avatarUri }} style={styles.avatar} />}
        {loading && <ActivityIndicator color="black" size="large"/>}
        </View>
        <View style={styles.containerTopRig}>
          {!loading && <ImagePicker handleImage={changeUserAvatarAsync} icon={<AntDesign name="camera" size={36} />} />}
        </View>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('ChangeName')} style={styles.container}>
        <View style={styles.lefContainer}>
          <FontAwesome name="user-circle"size={36} />
        </View>
          <View style={styles.midContainer}>
            <Text style={styles.info}> Name </Text>
            <Text style={styles.name}> {user.name} </Text>
            <Text allowFontScaling={false} style={styles.info}>
              This name identifies you in your chats and can be seen by other users
            </Text>
          </View>
        <View style={styles.rigContainer}>
          <MaterialCommunityIcons name="pencil" size={36}/>
        </View>
      </TouchableOpacity>

      <View style={styles.container}>
        <View style={styles.lefContainer}>
          <AntDesign name="mail"size={36} />
        </View>
          <View style={styles.midContainer}>
            <Text style={styles.info}> Email </Text>
            <Text style={styles.name}> {user.email} </Text>
          </View>
        <View style={styles.rigContainer}/>
      </View>
      <TouchableOpacity 
        style={[styles.logoutButton, {backgroundColor: loading ? 'grey' : '#fb5b5a'}]} 
        onPress={() => logoutAsync()}
        disabled={loading}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

export default SettingsScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 4,
  },
  containerTop: {
    flex: 2,
    flexDirection: "row",
  },
  containerTopMid: {
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerTopLef: {
    flex: 1,
  },
  containerTopRig: {
    flex: 1,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 50,
  },
  container: {
    flex: 1.5,
    flexDirection: "row",
    padding: 4,
    borderBottomColor: "grey",
    borderBottomWidth: 1,
  },
  lefContainer: {
    flexDirection: "row",
    flex: 1,
  },
  midContainer: {
    flex: 4,
    paddingLeft: 4,
  },
  rigContainer: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    color: "black",
  },
  info: {
    fontSize: 16,
    color: "grey",
  },
  logoutButton:{
    width:"80%",
    borderRadius:25,
    height:50,
    alignSelf: 'center',
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10
  },
  logoutText: {
    color: 'white',
  },
});
