const getUserDAOInstance = require("../dao/UserDAO");
const userDAO = getUserDAOInstance();

// test API
function testUser(req, res) {
   res.status(200).send("User Ok");
}

module.exports = { testUser };