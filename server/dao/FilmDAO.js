const dbConnection = require("./Database");
const Film = require("../models/Film");

class FilmDAO {
    #db;
    static instance;    // singleton instance

    constructor() {
        this.db = dbConnection;
    }

    static getFilmDAOInstance() {
        if(!FilmDAO.instance) {
            FilmDAO.instance = new FilmDAO();
        }
        return FilmDAO.instance;
    }

    // returns an array containing all the existing films in the DB
    getAll() {
        return new Promise((resolve, reject) => {
            const sqlQuery = `SELECT * 
                              FROM films`;

            this.db.all(sqlQuery, (err, rows) => {
                if (err) 
                    reject(err);
                else 
                    resolve(rows.map(row =>
                        new Film(row.id, row.title, row.favorite, row.watchdate, row.rating)));
            });
        });
    }

    // creates a new persistent Film in the DB and returns the new Film object with its assigned ID
    create(newFilm) {
        const newTitle = newFilm.title;
        const newFavorite = newFilm.favorite;
        const newWatchdate = newFilm.watchdate;
        const newRating = newFilm.rating;
        const newUser = 1;  // * temporary arbitrary data *

        return new Promise((resolve, reject) => {
            const sqlStatement = `INSERT INTO films(title, favorite, watchdate, rating, user)
                                  VALUES (?, ?, ?, ?, ?)`;
            
            const params = [newTitle, newFavorite, newWatchdate, newRating, newUser];

            this.#db.run(sqlStatement, params, function(err) {
                if (err)
                    reject(err);
                else
                    resolve(new Film(this.ID, newTitle, newFavorite, newWatchdate, newRating));
            });
        });
    }

    // update the provided film with the information contained in it
    // returns 'true' if the film was successfully updated; 'false' otherwise
    update(newFilm) {
        const filmId = newFilm.id;
        const newTitle = newFilm.title;
        const newFavorite = newFilm.favorite;
        const newWatchdate = newFilm.watchdate;
        const newRating = newFilm.rating;
        const newUser = 1;  // * temporary arbitrary data *

        return new Promise((resolve, reject) => {
            const sqlStatement = `UPDATE films 
                                  SET title=?, favorite=?, watchdate=?, rating=?, user=?
                                  WHERE id=?`;
            
            const params = [newTitle, newFavorite, newWatchdate, newRating, newUser, filmId];

            this.#db.run(sqlStatement, params, function(err) {
                if (err)
                    reject(err);
                else
                    resolve(this.changes > 0);
            });
        });
    }

    //TODO: implement functions below
}

module.exports = FilmDAO.getFilmDAOInstance;