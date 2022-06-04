const User = require("../models/User");
const db = require("./Database");
const crypto = require('crypto');
let instance;

class UserDAO {
   #db;

   constructor() {
      this.#db = db;
   }

   static getInstance() {
      if(!instance)
         instance = new UserDAO();

      return instance;
   }

   getUser(username, password) {
      return new Promise((resolve, reject) => {
         this.#db.get("SELECT * FROM users WHERE email=?", [username], (err, row) => {
            if(err) {
               console.log(err);
               reject(err);
            }
            else if (!row) {
               resolve(null); // email not found
            }
            else {
               let user = new User(row.id, row.email, row.name);

               crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) {
                  if(err) 
                     reject(err);
                  else if (!crypto.timingSafeEqual(Buffer.from(row.hash, 'hex'), hashedPassword))
                     resolve(false);   // password not correct
                  else
                     resolve(user);    // email and password correct
               });
            }
         });
      });
   }
}

module.exports = UserDAO.getInstance;