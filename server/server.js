const express = require('express');
const filmAPI = require("./api/FilmAPI");
const userAPI = require("./api/UserAPI");

const PORT = 3001;
app = new express();

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));

app.use("/api/films", filmAPI);
app.use("/api/users", userAPI);