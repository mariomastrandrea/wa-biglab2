const db = require("./Database");
const Film = require("../models/Film");
let instance;

class FilmDAO {
    #db;

    constructor() {
        this.db = db;
    }

    static getFilmDAOInstance() {
        if(!instance) {
            instance = new FilmDAO();
        }
        return instance;
    }

    getAll() {
        return new Promise((resolve, reject) => {
            this.db.all("SELECT * FROM films", (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows.map(row =>
                    new Film(row.id, row.title, row.favorite, row.watchdate, row.rating)));
            });
        });
    }

    //TODO: implement functions below
}

module.exports = FilmDAO.getFilmDAOInstance;