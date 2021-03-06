import {MovieDb} from 'moviedb-promise';
import config from '../../../../config';

const moviedb = new MovieDb(config.MOVIE_DB_KEY);

export default async (request, res) => {
  const {
    query: {name}
  } = request;

  const movies = await moviedb.searchMovie(name);

  res.json(movies.results.filter(movie => movie.vote_count > 20).sort((a, b) => {
    return new Date(b.release_date) - new Date(a.release_date);
  }));
};
