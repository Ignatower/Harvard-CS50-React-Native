import React, { useEffect } from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import * as ImagePickerExpo from 'expo-image-picker'

import { ImagePickerProps } from "../../types";
import styles from "./styles";


/*
  type ImagePickerProps = {
    handleImage: (image: any) => any;
    icon: JSX.Element;
    style?: object;
  };
*/

ImagePicker.propTypes = {
    handleImage: PropTypes.func,
    icon: PropTypes.element,
    style: PropTypes.object,
  }

function ImagePicker(props: ImagePickerProps):JSX.Element {

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePickerExpo.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImageAsync = async (): Promise<void> => {
    const result = await ImagePickerExpo.launchImageLibraryAsync({
      mediaTypes: ImagePickerExpo.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      props.handleImage(result);
    }
  };

  return (
    <TouchableOpacity onPress={pickImageAsync} style={props.style || styles.container}>
      {props.icon}
    </TouchableOpacity>
  );
}

export default ImagePicker;
