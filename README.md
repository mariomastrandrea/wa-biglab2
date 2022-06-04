# BigLab 2 - Class: 2022 [WA1-AJ/WA1-KZ]

## Team name: Frontend Enjoyers

Team members:
* s302219 MASTRANDREA MARIO
* s301208 PANIATI SIMONE 
* s295220 MARRA BENITO

## Instructions

A general description of the BigLab 2 is avaible in the `course-materials` repository, [under _labs_](https://polito-wa1-aw1-2022.github.io/materials/labs/BigLab2/BigLab2.pdf). In the same repository, you can find the [instructions for GitHub Classroom](https://polito-wa1-aw1-2022.github.io/materials/labs/GH-Classroom-BigLab-Instructions.pdf), covering BigLabs and exam sessions.

Once you cloned this repository, please write the group name and names of the members of the group in the above section.

In the `client` directory, do **NOT** create a new folder for the project, i.e., `client` should directly contain the `public` and `src` folders and the `package.json` files coming from BigLab1.

When committing on this repository, please, do **NOT** commit the `node_modules` directory, so that it is not pushed to GitHub.
This should be already automatically excluded from the `.gitignore` file, but double-check.

When another member of the team pulls the updated project from the repository, remember to run `npm install` in the project directory to recreate all the Node.js dependencies locally, in the `node_modules` folder.
Remember that `npm install` should be executed inside the `client` and `server` folders (not in the `BigLab2` root directory).

Finally, remember to add the `final` tag for the final submission, otherwise it will not be graded.

## Registered Users

Here you can find a list of the users already registered inside the provided database. This information will be used during the fourth week, when you will have to deal with authentication.
If you decide to add additional users, please remember to add them to this table (with **plain-text password**)!

| email                 | password | name  |
| --------------------- | -------- | ----- |
| john.doe@polito.it    | password | John  |
| mario.rossi@polito.it | password | Mario |
| testuser@polito.it    | password | Luigi |

## List of APIs offered by the server

### **Create a new user session (login)**

HTTP Method: `POST`

URL: `/api/login`

Description: Handles the login operation creating a new session with the provided username and password, if
they correspond to an existing user

Request body:
```
{
   "username": "john.doe@polito.it",
   "password": "password"
}
```

Response: `201 Created` (success) or `401 Unauthorized` (wrong username or password) or `500 Internal Server Error` (generic error).

Response body: *None*

### **Delete the current user session (logout)**

HTTP Method: `DELETE`

URL: `/api/logout`

Description: Handles the logout operation destroying the current session, if any, both in the client and in the server

Request body: *None*

Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body: *None*

### **Get the current session**

HTTP Method: `GET`

URL: `/api/sessions/current`

Description: Get the user information associated to the current session, if any

Request body: *None*

Response: `200 OK` (success) or `401 Unauthorized` (no active session) or `500 Internal Server Error` (generic error)

Response body:
```
{
   "id": 1,
   "email": "john.doe@polito.it",
   "name": "John"
}
```

### **Get all films** 

HTTP Method: `GET`

URL: `/api/films`

Description: Get the list of all the films related to the active user

Request body: *None*

Response: `200 OK` (success) or `401 Unauthorized` (no active session) or `500 Internal Server Error` (generic error)

Response body: 
```
[
   {
      "id": 1,
      "title": "Pulp Fiction",
      "favorite": true,
      "watchdate": "2022-03-11",
      "rating": 4
   }, 
   {
      "id": 2,
      "title": "21 Grams",
      "favorite": true,
      "watchdate": "2022-03-17",
      "rating": 4
   }, 
   {
      "id": 3,
      "title": "Star Wars",
      "favorite": false,
      "watchdate": null,
      "rating": null
   },
   ...
]
```
(if success) or a JSON object with an *error* field containing the error message

### **Get films by filter**

HTTP Method: `GET`

URL: `/api/films/filter/:filter`

Description: Get the list of the films related to the active user and associated to the provided `filter`, if that exist

Request body: *None*

Response: `200 OK` (success) or `404 Not Found` (not existing filter) or `401 Unauthorized` (no active session) or `500 Internal Server Error` (generic error)

Response body (if the filter is *favorite*): 
```
[
   {
      "id": 1,
      "title": "Pulp Fiction",
      "favorite": true,
      "watchdate": "2022-03-11",
      "rating": 4
   }, 
   {
      "id": 2,
      "title": "21 Grams",
      "favorite": true,
      "watchdate": "2022-03-17",
      "rating": 4
   }, 
   {
      "id": 6,
      "title": "Benny Sinatra",
      "favorite": true,
      "watchdate": "2022-06-18",
      "rating": 2
   },
   ...
]
```
(if success) or a JSON object with an *error* field containing the error message

### **Get a film by id**

HTTP Method: `GET`

URL: `/api/films/:filmId`

Description: Get the film information associated to the current user given the film's id

Request body: *None*

Response: `200 OK` (success) or `401 Unauthorized` (no active session) or `404 Not found` (film id not found) or `422 Unprocessable entity` (wrong id format) or `500 Internal Server Error` (generic error)

Response body (if *filmId* is 1):
```
{
   "id": 1,
   "title": "Pulp Fiction",
   "favorite": true,
   "watchdate": "2022-03-11",
   "rating": 4
}
```
(if success) or a JSON object with an *error* field containing the error message

### **Create a new film**

HTTP Method: `POST`

URL: `/api/films/`

Description: Store new film information provided in the request body linking them to the current user

Request body:
```
{
   "title": "Titanic",
   "favorite": true,
   "watchdate": 2022-04-21,
   "rating": 4
}
```

Response: `201 Created` (success) or `401 Unauthorized` (no active session) or `422 Unprocessable entity` (wrong body format) or `500 Internal Server Error` (generic error)

Response body: *None* (if success) or a JSON object with an *error* field containing the error message

### **Update an existing film**

HTTP Method: `PUT`

URL: `/api/films/:filmId`

Description: Update all the film information associated to the current user given the film's id

Request body:
```
{  
   "title": "Titanic",
   "favorite": false,
   "watchdate": null,
   "rating": 1
}
```

Response: `200 OK` (success) or `404 Not Found` (film id not found) `422 Unprocessable entity` (wrong film id format or wrong body format) or `500 Internal Server Error` (generic error)

Response body: *None* (if success) or a JSON object with an *error* field containing the error message

### **Update film field (e.g. favorite)**

HTTP Method: `PATCH`

URL: `/api/films/:filmId`

Description: Update a field of the provided film associated to the current user; e.g. it can update the *favorite* field, setting it to *true* or *false* for the active user

Request body: 
```
{
   "favorite": true
}
```

Response: `200 OK` (success) or `401 Unauthorized` (no active session) or `404 Not Found` (film id not found) `422 Unprocessable entity` (wrong film id format or wrong body format) or `500 Internal Server Error` (generic error)

Response body: *None* (if success) or a JSON object with an *error* field containing the error message

### **Delete a film by id**

HTTP Method: `DELETE`

URL: `/api/films/:filmId`

Description: Delete the film information associated to the current user given the film's id, if it exists

Request body: *None*

Response: `204 No Content` (success) or `401 Unauthorized` (no active session) or `404 Not Found` (film id not found) or `422 Unprocessable entity` (wrong film id format) or `500 Internal Server Error` (generic error)

Response body: *None* (if success) or a JSON object with an *error* field containing the error message
