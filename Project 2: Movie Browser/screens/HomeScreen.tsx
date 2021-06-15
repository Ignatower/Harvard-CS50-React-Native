import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Button } from "react-native-elements";

import { DEFAULT_MOVIES } from "../data/mockData";
import { Movie } from "../types";
import MovieRow from "../components/Movie";
import SearchForm from "../components/SearchForm";
import { fetchMovies } from "../api";

const HomeScreen = (props): JSX.Element => {
  const [movies, setMovies] = useState(DEFAULT_MOVIES);
  const [searchDone, setSearchDone] = useState(false);
  const [waiting, setWaiting] = useState(false);

  const setState = (movies: Movie[], searchDone: boolean): void => {
    setMovies(movies);
    setSearchDone(searchDone);
  };

  const getSearchedMovies = async (title: string): Promise<void> => {
    setWaiting(true);
    try {
      const moviesSearched: Movie[] = await fetchMovies(title);
      setState(moviesSearched, true);
    } catch (err) {
      const errMessage = err.message;
      Alert.alert("Error ", errMessage);
    } finally {
      setWaiting(false);
    }
  };

  const getAllMovies = (): void => {
    setState(DEFAULT_MOVIES, false);
  };

  // sometimes omdbapi get many movies with the same imdbID
  const keyExtractor = (item, index): string =>
    item.imdbID + "#" + String(index);

  const renderItem = ({ item }): JSX.Element => <MovieRow {...item} />;

  const found = movies.length > 0;

  return (
    <View style={styles.screen}>
      <SearchForm onSubmit={getSearchedMovies} />
      {waiting && (
        <ActivityIndicator style={styles.padding} size="large" color="white" />
      )}
      {searchDone && found && (
        <Text style={styles.results}>Results: {movies.length}</Text>
      )}
      {searchDone && (
        <Button
          style={styles.padding}
          title="Show Default Movies"
          onPress={getAllMovies}
        />
      )}
      {!found && <NotFound />}
      {found && (
        <FlatList
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          data={movies}
          navigation={props.navigation}
        />
      )}
    </View>
  );
};

const NotFound = (): JSX.Element => (
  <View>
    <Text style={styles.textNotFound}>
      Not results for you search. Please try another title.
    </Text>
  </View>
);

export default HomeScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  label: {
    textAlign: "center",
  },
  textNotFound: {
    color: "darkred",
    fontSize: 20,
    margin: 20,
  },
  results: {
    color: "white",
    fontSize: 22,
    alignSelf: "center",
  },
  padding: {
    padding: 10,
  },
});
