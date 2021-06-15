import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import PropTypes from "prop-types";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/AntDesign";

const TextMovie = (props): JSX.Element => {
  const { title } = props;
  if (title.includes("-")) {
    const first = title.split("-")[0];
    const second = title.split("-")[1];
    return (
      <View>
        <Text style={styles.text}>{first}</Text>
        <Text style={styles.text}>{second}</Text>
      </View>
    );
  }
  return (
    <View>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};

TextMovie.propTypes = {
  title: PropTypes.string,
};

const Movie = (props): JSX.Element => {
  const navigation = useNavigation();
  const { Poster, Title, imdbID } = props;
  return (
    <View style={styles.container}>
      <View>
        <Image source={{ uri: Poster }} style={styles.image} />
      </View>

      <View style={styles.titleContainer}>
        <TextMovie title={Title} />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          type="clear"
          icon={<Icon name="right" size={40} color="white" />}
          onPress={() => {
            navigation.navigate("Details", {
              imdbID,
              Poster,
              Title,
            });
          }}
        />
      </View>
    </View>
  );
};

Movie.propTypes = {
  imdbID: PropTypes.string,
  Poster: PropTypes.string,
  Title: PropTypes.string,
};

const shouldNotUpdateComponentIf = (prevProps, nextProps): boolean =>
  prevProps.title === nextProps.title;

export default React.memo(Movie, shouldNotUpdateComponentIf);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    margin: 10,
  },
  titleContainer: {
    flex: 4,
  },
  buttonContainer: {
    flex: 1,
    alignSelf: "center",
  },
  text: {
    marginLeft: 4,
    color: "lightgray",
    fontSize: 16,
  },
  image: {
    width: 100,
    height: 100,
  },
});
