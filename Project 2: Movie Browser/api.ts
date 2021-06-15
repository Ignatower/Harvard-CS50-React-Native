import { Movie, MovieDetails } from "./types";

const BASE_URL = "http://www.omdbapi.com/?type=movie&plot=full&r=json";

const API_KEY = "YOUR_SECRET_KEY";

const formatSearchFromTitle = (title: string): string => {
  const arrSearch = title.split(" ");
  let search = "";
  let word = "";
  for (word of arrSearch) {
    if (word) {
      search += `${word}+`;
    }
  }
  if (search) {
    if (search[search.length - 1] === "+") {
      search = search.slice(0, -1);
    }
  }

  return search;
};

const fetchMoviesFromPage = async (
  url: string,
  iPage: number
): Promise<Movie[]> => {
  const response = await fetch(`${url}&page=${String(iPage)}`);
  if (!response.ok)
    throw new Error("There was a problem fetching your request");
  const results = await response.json();
  if (results.Response === "False") {
    return [];
  }

  return results.Search;
};

export const fetchMovies = async (title: string): Promise<Movie[]> => {
  const search = formatSearchFromTitle(title);
  const url = `${BASE_URL}&s=${search}${API_KEY}`;
  const response = await fetch(url);
  if (!response.ok)
    throw new Error("There was a problem fetching your request");
  const results = await response.json();
  if (results.Response === "False") {
    return [];
  }
  let moviesSearched = results.Search;
  let moviesFromPage = [];
  const pagesCount = Math.ceil(results.totalResults / 10);
  for (let i = 2; i < pagesCount + 1; i++) {
    moviesFromPage = await fetchMoviesFromPage(url, i);
    moviesSearched = [...moviesSearched, ...moviesFromPage];
  }

  return moviesSearched;
};

export const fetchMovieByimbdID = async (
  imbdID: string
): Promise<MovieDetails> => {
  const url = `${BASE_URL}&i=${imbdID}${API_KEY}`;
  const response = await fetch(url);
  if (!response.ok)
    throw new Error("There was a problem fetching your request");
  const results = await response.json();

  return results;
};
