import {Movie, Trailer} from '../../../../models';
import {protect} from '../../util/auth';

export default async (request, res) => {
  const {
    query: {id},
    body,
    method
  } = request;

  if (method === 'GET') {
    res.json(await getMovieById(id));
  }

  if (method === 'PUT') {
    await protect(request, res, {permissions: ['canEditPages']});

    res.json(await Movie.update(body, {where: {id}}));
  }

  if (method === 'DELETE') {
    await protect(request, res, {permissions: ['canEditPages']});

    await Movie.destroy({where: {id}});

    res.json({});
  }
};

const getMovieById = id => {
  return Movie.findByPk(id, {include: [
    Movie.associations.Poster,
    Movie.associations.Showtimes,
    {
      model: Trailer,
      include: Trailer.associations.File
    }
  ]});
};
