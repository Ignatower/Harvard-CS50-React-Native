import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Image, Alert } from "react-native";

import { fetchMovieByimbdID } from "../api";
import { MovieDetails } from "../types";

const DetailScreen = ({ route }): JSX.Element => {
  const [movie, setMovie] = useState({});
  const [waiting, setWaiting] = useState(true);
  const { imdbID, Poster, Title } = route.params;

  const getMovieByimbdID = async (): Promise<void> => {
    try {
      const movieSearched: MovieDetails = await fetchMovieByimbdID(imdbID);
      setMovie(movieSearched);
    } catch (err) {
      const errMessage = err.message;
      Alert.alert("Error ", errMessage);
    } finally {
      setWaiting(false);
    }
  };

  useEffect(() => {
    getMovieByimbdID();
  }, [waiting]);

  if (waiting === true) {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}> {Title} </Text>
      </View>
    );
  }
  const { imdbRating, Genre, Actors, Director } = movie;
  return (
    <View style={styles.screen}>
      <Text style={styles.title}> {Title} </Text>
      <Text style={styles.label}>
        imdbRating: {imdbRating} Genre: {Genre}
      </Text>
      {Actors !== "N/A" && <Text style={styles.label}> Actors: {Actors} </Text>}
      {Director !== "N/A" && (
        <Text style={styles.label}> Director: {Director} </Text>
      )}
      <View style={styles.container}>
        <Image
          resizeMode="contain"
          source={{ uri: Poster }}
          style={styles.image}
        />
      </View>
    </View>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    color: "lightgray",
    margin: 4,
  },
  label: {
    alignSelf: "flex-start",
    color: "lightgray",
    margin: 4,
  },
  container: {
    flex: 1,
    width: "90%",
    height: "70%",
    alignItems: "center",
  },
  image: {
    flex: 1,
    width: 300,
    height: 445,
  },
});
