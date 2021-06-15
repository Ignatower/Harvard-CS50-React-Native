export type RootStackParamList = {
  Login: undefined;
  Tab: undefined;
  Details: { imdbID: string; Poster: string; Title: string };
};

export type TabParamList = {
  Home: undefined;
  Profile: undefined;
};

export type Movie = {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
};

type Rating = {
  Source: string;
  Value: string;
};

export type MovieDetails = {
  Actors: string;
  Awards: string;
  BoxOffice: string;
  Country: string;
  DVD: string;
  Director: string;
  Genre: string;
  Language: string;
  Metascore: string;
  Plot: string;
  Poster: string;
  Production: string;
  Rated: string;
  Ratings: Rating[];
  Released: string;
  Response: string;
  Runtime: string;
  Title: string;
  Type: string;
  Website: string;
  Writer: string;
  Year: string;
  imdbID: string;
  imdbRating: string;
  imdbVotes: string;
};
