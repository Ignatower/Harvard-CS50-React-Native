import React, { useState, useCallback } from "react";
import {
  Button,
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useDispatch } from "react-redux";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import firebase from "../firebase/config";
import { updateUser } from "../redux/actions";


function LoginScreen(props): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch()

  const resetForm = (): void => {
    setEmail("")
    setIsNewUser(false)
    setPassword("")
  }

  // reset Login form after unfocus
  useFocusEffect(
    useCallback(() => {
      return () => {
        resetForm()
      };
    }, [])
  );

  const navigateToRoot = (): void => {
    navigation.navigate("Root");
  }

  // validate sintax of email
  // https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript?answertab=votes#tab-top
  const validateEmail = (email: string): boolean => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  // set user in redux
  const setCurrentUser = (user): void => {
    dispatch(updateUser(user))
  }

  const loginAsync = async (): Promise<void> => {
    setLoading(true)
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      const dbRef = firebase.database().ref();
      const userPromise = await dbRef.child("users").child(userCredential.user.uid).get()
      let user = {
        uid: userCredential.user.uid,
        location: null,
        email: userCredential.user.email,
        ...userPromise.val()
      }
      if (!user.name) {
        user = {...user, name: user.email}
      }
      setCurrentUser(user);
      navigateToRoot();
    } catch (error) {
        if (error.code === 'auth/wrong-password') {
          alert('Wrong password.');
        } else {
          alert(error.message);
        }
    } finally {
      setLoading(false)
    }
  }

  const signUpAsync = async (): Promise<void> => {
    setLoading(true)
    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password)
      const user = {
        uid: userCredential.user.uid, 
        location: null, 
        name: userCredential.user.email, 
        email: userCredential.user.email, 
        groups: {}
      }
      setCurrentUser(user)
      const updates = {};
      updates['/users/' + user.uid] = user;
      firebase.database().ref().update(updates)
      navigateToRoot();
    } catch (error) {
        alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isNewUser) {
    return (
      <View style={styles.container}>
        <Text allowFontScaling={false} style={styles.logo}>GeoGroups!</Text>
        <View style={styles.inputView} >
          <TextInput  
            placeholder="Email..." 
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            placeholderTextColor="#003f5c"
            style={styles.inputText}
            />
        </View>
        <View style={styles.inputView} >
          <TextInput  
            placeholder="Password..." 
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            secureTextEntry
            placeholderTextColor="#003f5c"
            style={styles.inputText}
            />
        </View>
        {!loading && <TouchableOpacity 
          style={(!validateEmail(email) || password === "") ? styles.loginBtnDisabled : styles.loginBtn} 
          onPress={loginAsync} 
          disabled={!validateEmail(email) || password === ""}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>}
        {loading && <ActivityIndicator color="black" size="large"/>}
        {!loading && <TouchableOpacity onPress={() => setIsNewUser(true)}>
          <Text style={styles.loginText}>Signup</Text>
        </TouchableOpacity>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text allowFontScaling={false} style={styles.logo}>GeoGroups!</Text>
      <View style={styles.inputView} >
        <TextInput  
          placeholder="Email..." 
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          placeholderTextColor="#003f5c"
          style={styles.inputText}
          />
      </View>
      <View style={styles.inputView} >
        <TextInput  
          placeholder="Password..." 
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          secureTextEntry
          placeholderTextColor="#003f5c"
          style={styles.inputText}
          />
      </View>
      {!loading && <TouchableOpacity 
        style={(!validateEmail(email) || password === "") ? styles.loginBtnDisabled : styles.loginBtn} 
        onPress={signUpAsync} 
        disabled={!validateEmail(email) || password === ""}>
        <Text style={styles.loginText}>SIGNUP</Text>
      </TouchableOpacity>}
      {loading && <ActivityIndicator color="black" size="large"/>}
      {!loading && <TouchableOpacity onPress={() => setIsNewUser(false)}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>}
    </View>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2f95dc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo:{
    fontWeight:"bold",
    fontSize:50,
    color:"white",
    marginBottom:40
  },
  inputView:{
    width:"80%",
    backgroundColor:"#465881",
    borderRadius:25,
    height:50,
    marginBottom:20,
    justifyContent:"center",
    padding:20
  },
  inputText:{
    height:50,
    color:"white"
  },
  loginBtn:{
    width:"80%",
    backgroundColor:"#fb5b5a",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10
  },
    loginBtnDisabled: {
    width:"80%",
    backgroundColor:"grey",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10
  },
  loginText:{
    color:"white"
  }
});