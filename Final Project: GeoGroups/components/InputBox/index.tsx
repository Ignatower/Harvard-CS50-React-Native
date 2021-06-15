import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import PropTypes from 'prop-types';
import {
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome5,
  Entypo,
  Fontisto,
} from "@expo/vector-icons";
import moment from "moment";

import ImagePicker from "../ImagePicker";
import { InputBoxProps } from "../../types"
import { MAX_LENGTH_TEXT } from "../../constants/Values";
import styles from "./styles";


InputBox.propTypes = {
  sendTextMessage: PropTypes.func,
  sendImageMessageAsync: PropTypes.func,
}

/*
  type InputBoxProps = {
    sendTextMessage: (message: string) => void;
    sendImageMessageAsync: (image: string) => Promise<void>;
  };
*/

function InputBox(props: InputBoxProps): JSX.Element {
  const [message, setMessage] = useState("");
  const { sendTextMessage, sendImageMessageAsync } = props
  const textIsEmpty = (message.trim() === '')

  const sendText = (): void => {
    if (message.length < MAX_LENGTH_TEXT) {
      sendTextMessage(message)
      setMessage("");
    } else {
      alert("text too long to send")
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardView}
    >
      <View style={styles.container}>
        <View style={styles.boxContainer}>
          <TextInput
            placeholder="Type a message"
            style={styles.textInput}
            multiline
            value={message}
            onChangeText={setMessage}
          />
          {textIsEmpty && (
            <ImagePicker 
              style={styles.clip} 
              handleImage={(image) => sendImageMessageAsync(image.uri)} 
              icon={
                <Entypo
                  name="attachment"
                  size={22}
                  color="grey"
                />} 
            />)
          }
        </View>
        {textIsEmpty && <MaterialIcons style={styles.sendWhite} name="send" size={28} color="white"/>}
        {!textIsEmpty && (
          <TouchableOpacity  style={styles.sendGrey} onPress={() => sendText()}>
            <MaterialIcons name="send" size={28} color="grey" />
          </TouchableOpacity>)
        }
      </View>
    </KeyboardAvoidingView>
  );
};

export default InputBox;
