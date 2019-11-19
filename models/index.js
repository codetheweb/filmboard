const Sequelize = require('sequelize');
const {DB_URL, DB_DIALECT} = require('../config');

const fileModel = require('./File');
const userModel = require('./User');
const movieModel = require('./Movie');
const pageModel = require('./Page');
const pageCategoryModel = require('./PageCategory');
const showtimeModel = require('./Showtime');
const trailerModel = require('./Trailer');

const sequelize = new Sequelize(DB_URL, {
  dialect: DB_DIALECT
});

const File = fileModel(sequelize, Sequelize);
const User = userModel(sequelize, Sequelize);
const Movie = movieModel(sequelize, Sequelize);
const Page = pageModel(sequelize, Sequelize);
const PageCategory = pageCategoryModel(sequelize, Sequelize);
const Showtime = showtimeModel(sequelize, Sequelize);
const Trailer = trailerModel(sequelize, Sequelize);

Movie.hasMany(Showtime);
Movie.hasOne(File, {as: 'Poster'});
Movie.hasOne(Trailer);

Trailer.hasOne(File);

PageCategory.hasMany(Page);

module.exports = {sequelize, File, User, Movie, Page, PageCategory, Showtime, Trailer};
