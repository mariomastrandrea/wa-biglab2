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
            else {
               if(row === undefined) {
                  return resolve(undefined);
               }
               let user = new User(row.id, row.email, row.name, row.hash, row.salt);
               crypto.scrypt(password,user.salt,32,function(err,hashedpass){
                  if(err) {
                     reject(err);
                  }
                  else{
                     if(!crypto.timingSafeEqual(Buffer.from(row.hash, 'hex'), hashedpass))
                        resolve(false);
                     else
                        resolve(user);
                  }
               });
            }
         });
      })
   }
}

module.exports = UserDAO.getInstance;