import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  ScrollView,
  View,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import {
  AntDesign,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  uploadImageAsync,
  downloadImageAsync,
  firebaseCreateGroup,
} from "../firebase/helpers";
import { joinGroup } from "../redux/actions";
import ImagePicker from "../components/ImagePicker";
import { MAX_RADIUS, DEFAULT_RADIUS } from "../constants/Values";


function CreateGroupScreen({ navigation, route }): JSX.Element {
  // form states
  const [avatarUri, setAvatarUri] = useState(null)
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState(null)
  const [place, setPlace] = useState(null)
  const [radius, setRadius] = useState("")

  const [loading, setLoading] = useState(false)
  // errors states
  const [errTitle, setErrTitle] = useState(true)
  const [errTitleMessage, setErrTitleMessage] = useState("")
  const [errRadius, setErrRadius] = useState(true)
  const [errRadiusMessage, setErrRadiusMessage] = useState("")

  const user = useSelector(state => state.user)
  const { uid } = user
  const dispatch = useDispatch()


  // always keep title and radius validated. (defensive programming)
   useEffect(() => {
    const titleIsOk = (): void => {
      if (title==='') {
        setErrTitleMessage("")
        setErrTitle(true)
      } else if (title.length < 5) {
        setErrTitleMessage("Name must be at least 5 characters long")
        setErrTitle(true)
      } else if (!/^[a-z0-9\s]+$/i.test(title)) {
        setErrTitleMessage("Name can only have alpha numeric characters")
        setErrTitle(true)
      } else if (title.length > 32) {
        setErrTitleMessage("Name must not exceed 32 characters")
        setErrTitle(true)
      } else if (!title.match(/[a-z]/gi)) {
        setErrTitleMessage("Name must have al least 3 letters")
        setErrTitle(true)
      } else if (title.match(/[a-z]/gi).length < 3) {
        setErrTitleMessage("Name must have al least 3 letters")
        setErrTitle(true)
      } else {
        setErrTitleMessage("")
        setErrTitle(false)
      }
    }


    const radiusIsOk = (): void => {
      if (!radius) {
        setErrRadiusMessage("")
        setErrRadius(false)
      } else if (Number(radius) > MAX_RADIUS) {
        setErrRadiusMessage("Radius must be less than " + MAX_RADIUS)
        setErrRadius(true)
      } else {
        setErrRadiusMessage("")
        setErrRadius(false)
      }
    }
    const validateForm = (): void => {
      titleIsOk()
      radiusIsOk()
    }

     validateForm()
   }, [title, location, radius, avatarUri])
  
    const locationIsOk = (): boolean => {
      if (!location)
        return false
      if (!location.latitude || !location.longitude)
        return false
      return true
    }

  // convert place to a readable string
  const formatPlace = (): string => {
    if (!place) return '';
    if (!place[0]) return "Unamed Road";
    const { city, country, street, subregion } = place[0];
    const City = !city ? "" : ", " + city;
    const Country = !country ? "" : ", " + country;
    const Subregion = !subregion ? "" : ", " + subregion;
    const Street = !street ? "" : street;

    return Street + Subregion + City + Country;
  };

  // create group in backend. current user is a member of the group
  const createGroup = (): void => {
    const group = {
      membersCount: 1, 
      title, 
      coords: {
        latitude: location.latitude, 
        longitude: location.longitude,
        radius: Number(radius) || Number(DEFAULT_RADIUS)
      }, 
      place: formatPlace(),
      avatarUri,
    }
    const createdAt = Date.now();
    const id = firebaseCreateGroup(group, createdAt, uid)
    dispatch(joinGroup(id))
    navigation.goBack()
  }

  // handle location and place params from AddLocationScreen
  useEffect(()=>{
    if (route.params?.location) {
      setLocation(route.params.location)
      setPlace(route.params.place)
    }
  },[route.params?.location, route.params?.place])

  const changeGroupAvatarAsync = async (image): Promise<void> => {
    // disable Create button while waiting for image 
    setLoading(true)
    const imageUri = image.uri
    const name = String(Date.now()) + uid
    const path = `groups/`
    await uploadImageAsync(path, name, imageUri)
    // firebase storage uri of image
    const avatarUri  = await downloadImageAsync(path, name)
    if (avatarUri) {
      setAvatarUri(avatarUri)
    }
    setLoading(false)
  }

    return (
      <KeyboardAwareScrollView
       style={styles.screen}
      >
        <View style={styles.container}>
          <View style={styles.containerTopLef}/>
            <View style={styles.containerTopMid}>
              {!loading && !avatarUri && <Image
                  source={require("../assets/images/icon_group.png")}
                  style={styles.avatar}
              />}
            {!loading && avatarUri && <Image source={{ uri: avatarUri }} style={styles.avatar} />}
            {loading && <ActivityIndicator color="black" size="large"/>}
            </View>
          <View style={styles.containerTopRig}>
            {!loading && <ImagePicker handleImage={changeGroupAvatarAsync} icon={<AntDesign name="camera" size={36} />} />}
          </View>
        </View>

        <View style={styles.container}>
          <View style={styles.containerAvatar}>
            <FontAwesome name="pencil" size={34} />

          </View>
          <View style={styles.containerInputTitle}>
            <TextInput
              placeholder="Name of the group"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="grey"
              style={styles.textInput}
            />
            {errTitle && <Text style={styles.textError}>{errTitleMessage}</Text>}
          </View>
        </View>
        <View style={styles.container}>
          <TouchableOpacity 
            onPress={()=> navigation.navigate('AddLocation')} 
            style={styles.containerAvatar}
          >
            <Image
              source={require("../assets/images/icon_map.png")}
              style={styles.map}
            />
          </TouchableOpacity>
          <View style={styles.containerInputTitle}>
            {place !== null && <Text style={styles.textLocation}>{formatPlace(place)}</Text>}
            {!place && <Text style={styles.textLocation}>Set group location</Text>}
          </View>
        </View>        
        <View style={styles.container}>
          <View style={styles.containerAvatar}>
            <MaterialCommunityIcons name="map-marker-radius" size={50} />
            </View>
            <View style={styles.containerInputTitle}>
              <TextInput
                placeholder="Radius in m (default 3000)"
                keyboardType="numeric"
                value={radius}
                onChangeText={setRadius}
                placeholderTextColor="grey"
                allowFontScaling={false}
                style={styles.textInput}
              />
              {errRadius && 
                <Text 
                  allowFontScaling={false} 
                  style={styles.textError}>{errRadiusMessage}
                </Text>
              }
          </View>
        </View>
        <TouchableOpacity 
          onPress={createGroup}
          disabled={errTitle || errRadius || loading || !locationIsOk()}
          style={[styles.button, {
            backgroundColor: errTitle || errRadius || loading || !locationIsOk() ? 'lightblue' : '#2f95dc'}]}
        >
          <Text style={styles.buttonText}>Create</Text>
        </TouchableOpacity>
     </KeyboardAwareScrollView> 
    );
  }

export default CreateGroupScreen

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
  screen: {
    flex: 1,
    margin: 4,
  },
  container: {
    flexDirection: 'row',
    marginTop: 4,
    borderBottomColor: 'grey',
    borderBottomWidth: 4,
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
  containerInputTitle: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  containerAvatar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    marginLeft: 4,
    fontSize: 16,
    borderBottomColor: 'lightblue',
    borderBottomWidth: 2,
    paddingBottom: 4,
  },
    textLocation: {
    marginLeft: 4,
    fontSize: 16,
    paddingBottom: 4,
  },
    textError: {
      color: 'red',
    },
    map: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
    avatar: {
    width: 150,
    height: 150,
    borderRadius: 50,
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
