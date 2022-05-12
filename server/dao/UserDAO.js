const User = require("../models/User");
const db = require("./Database")
let instance;

class UserDAO {
   #db;

   constructor() {
      this.db = db;
   }

   static getInstance() {
      if(!instance)
         instance = new UserDAO();

      return instance;
   }

   // TODO: remove/review method
   getUser() {
      return User();
   }
}

module.exports = UserDAO.getInstance;