import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import PropTypes from "prop-types";
import Icon from "react-native-vector-icons/FontAwesome";
import { Button } from "react-native-elements";

const SearchForm = (props): JSX.Element => {
  const [title, setTitle] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const handleTitleChange = (title: string): void => {
    setTitle(title);
  };

  const handleSubmit = (): void => {
    props.onSubmit(title);
    setTitle("");
  };

  const validateForm = (): void => {
    if (title) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  useEffect(() => {
    validateForm();
  }, [title]); // Only re-run the effect if title changes

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.text}
        placeholderTextColor="grey"
        placeholderBack
        value={title}
        onChangeText={handleTitleChange}
        placeholder="Search"
        autoCapitalize="none"
      />
      <Button
        type="clear"
        icon={<Icon name="search" size={20} color="white" />}
        onPress={handleSubmit}
        disabled={!isFormValid}
      />
    </View>
  );
};

SearchForm.propTypes = {
  onSubmit: PropTypes.func,
};

export default SearchForm;

const styles = StyleSheet.create({
  container: {
    margin: 4,
  },
  text: {
    color: "grey",
    backgroundColor: "white",
    fontSize: 16,
    paddingLeft: 4,
  },
});
