import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import firebase from "../firebase/config";
import { firebaseChangeUserName } from "../firebase/helpers";
import { updateUser } from "../redux/actions";


function ChangeNameScreen(props): JSX.Element {
  const [name, setName] = useState("")
  const [errMessage, setErrMessage] = useState("")
  const [sintaxError, setSintaxError] = useState(true)
  const [isAvailable, setIsAvailable] = useState(true)
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation()
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  // check if name is avaliable in backend
  const nameIsAvailableAsync =  async (): Promise<void> => {
    setLoading(true)
    const snapshot =  await firebase.database().ref(`usersName/${name}/`).once("value")
    setIsAvailable(!snapshot.exists())
    setLoading(false)
  }

  const nameSintaxIsOk = (): boolean => {
    if (name==='') {
      setErrMessage("")
      setSintaxError(true)
      return false
    } else if (name.length < 5) {
      setErrMessage("Username must be at least 5 characters long")
      setSintaxError(true)
      return false
    } else if (!/^[a-z0-9]+$/i.test(name)) {
      setErrMessage("Username can only have alpha numeric characters")
      setSintaxError(true)
      return false
    } else if (name.length > 32) {
      setErrMessage("Username must not exceed 32 characters")
      setSintaxError(true)
      return false
    } else {
      setErrMessage("")
      setSintaxError(false)
      return true
    }
  }

  const saveUserName = (): void => {
    if (!nameSintaxIsOk()) {
      alert("Sorry, we have a problem with that name, try other name or try later")
    } else {
      firebaseChangeUserName(user.name, user.email, name, user.uid)
      dispatch(updateUser({name: name}))
      navigation.goBack()
    }
  }

  useEffect(() => {
    if (nameSintaxIsOk()) {
      nameIsAvailableAsync()
    }
  },[name]);

  return (
    <View style={styles.screen}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder={user.name}
          value={name}
          onChangeText={setName}
          autoCapitalize="none"
          placeholderTextColor="grey"
          autoFocus
          style={styles.textInput}
        />
      </View>
      <View style={styles.container}>
        {sintaxError && <Text style={styles.error}>{errMessage}</Text>}
        {loading && <Text>Checking  user name...</Text>}
        {!loading && !sintaxError && isAvailable && <Text 
          style={styles.ok}>User name available</Text>}
        {!loading && !sintaxError && !isAvailable && <Text 
          style={styles.error}>User name not available</Text>}
        <TouchableOpacity 
          onPress={saveUserName}
          disabled={sintaxError || !isAvailable || loading}
          style={[styles.button, {
            backgroundColor: sintaxError || !isAvailable || loading ? 'lightblue' : '#2f95dc'}]}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
    );
  }

export default ChangeNameScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  inputContainer: {
    margin: 4,
    borderColor: "grey",
    borderWidth: 2,
    flexDirection: "row",
  },
  container: {
    margin: 4,
    justifyContent:'space-between',
  },
  textInput: {
    marginLeft: 4,
  },
  error: {
    color: "red",
  },
  ok: {
    color: "green",
  },
  button:{
    width:"80%",
    borderRadius:25,
    height:50,
    alignSelf: 'center',
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10
  },
  buttonText: {
    color: 'white',
  },
});
