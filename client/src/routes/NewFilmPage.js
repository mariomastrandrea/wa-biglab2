import { Row } from "react-bootstrap"
import FilmForm from "../components/filmComponents/FilmForm";
import FilmLibraryNavbar from "../components/filmComponents/FilmLibraryNavbar";

function NewFilmPage(props) {
   return (
      <>
         <Row as="header">
            <FilmLibraryNavbar title="Add new film" />
         </Row>
         <FilmForm addFilm={props.addFilm} />
      </>
   );
}

export default NewFilmPage;