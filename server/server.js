const express = require('express');
const filmAPI = require("./api/FilmAPI");
const userAPI = require("./api/UserAPI");
const cors = require("cors");

const PORT = 3001;
app = new express();
app.use(express.json());
const corsOptions = {
   origin: 'http://localhost:3000',
   optionsSuccessStatus: 200
 }
app.use(cors(corsOptions));
app.use("/api/films", filmAPI);
app.use("/api/users", userAPI);

app.listen(PORT, () => 
   console.log(`Server running on http://localhost:${PORT}/`));