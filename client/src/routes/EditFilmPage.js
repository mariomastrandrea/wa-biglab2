import { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import ErrorBox from "../components/ErrorBox";
import SpinnerBox from "../components/SpinnerBox";
import FilmLibraryNavbar from "../components/filmComponents/FilmLibraryNavbar";
import FilmForm from "../components/filmComponents/FilmForm";
import { useUser, useUpdateUser } from "../UserContext";
import { getCurrentSession } from "../API";


function EditFilmPage(props) {
   const filmId = Number(useParams().filmId);
   const [film, setFilm] = useState(null);
   const user = useUser();
   const updateUser = useUpdateUser();
   const navigate = useNavigate();

   const { 
      loading, errorMessage, getFilm, 
      setLoading, setErrorMessage, 
      setSuccessMessage 
   } = props;

   useEffect(() => {
      if(!user) {
         getCurrentSession().then(user => {
            if(!user) {
               // user is not authenticated yet -> redirect to login page
               setLoading(false);
               navigate("/login");
               return;
            }

            updateUser(user);
            // user is logged in -> edit his film
            getFilm(filmId).then(film => {
               setFilm(film);
               setLoading(false);
            })
            .catch(() => {
               setErrorMessage("Cannot load the requested film")
               setLoading(false);
            });
         });
      }
      else {  // user is logged in -> edit his film
         getFilm(filmId).then(film => {
            setFilm(film);
            setLoading(false);
         })
         .catch(() => {
            setErrorMessage("Cannot load the requested film")
            setLoading(false);
         });
      }

      // eslint-disable-next-line
   }, []);

   const headerContent =
      <Row as="header">
         <FilmLibraryNavbar title="Edit film" setLoading={setLoading} 
            setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage} />
      </Row>

   if (loading && !film) { // if the page is loading -> display only the spinner
      return <>
         {headerContent}
         <SpinnerBox />
      </>;
   }

   if (loading && film) {  // the update is in progress
      return <>
         {headerContent}
         <SpinnerBox small={true} />
         <FilmForm editMode={true} editFilm={props.editFilm} film={film} setLoading={setLoading} setFilm={setFilm}
            setErrorMessage={setErrorMessage} loading={loading} setSuccessMessage={setSuccessMessage} />
      </>;
   }

   if (errorMessage && !film)  // if there was a connection error retrieving the film -> show the error message only
      return <>
         {headerContent}
         <ErrorBox>{errorMessage}</ErrorBox>
      </>;

   if (errorMessage && film) // if there was an error during the film update -> show the error message and keep the film data
      return <>
         {headerContent}
         <ErrorBox>{errorMessage}</ErrorBox>
         <FilmForm editMode={true} editFilm={props.editFilm} film={film} setFilm={setFilm}
            setLoading={setLoading} setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage} />
      </>;

   // * there isn't any error here *

   if (!film) // film not found 
      return <>
         {headerContent}
         <ErrorBox>{"ERROR: please search for a correct film ID"}</ErrorBox>
      </>;

   // all ok
   return (
      <>
         {headerContent}
         <FilmForm editMode={true} editFilm={props.editFilm} film={film} setFilm={setFilm}
            setLoading={setLoading} setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage} />
      </>
   );
}

export default EditFilmPage;