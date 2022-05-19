import { Container, Row, Col } from 'react-bootstrap';
import { useParams } from "react-router-dom";
import FiltersBox from '../components/FiltersBox';
import AddButton from '../components/AddButton';
import ErrorBox from '../components/ErrorBox';
import FilmTable from '../components/filmComponents/FilmTable';
import FilmLibraryNavbar from '../components/filmComponents/FilmLibraryNavbar.js';
import { revertFromSnakeCase } from "../utilities.js"

function Home(props) {
   const param = useParams();

   const filters = props.filters;
   const activeFilter = props.activeFilter || param.activeFilter?.toLowerCase();
   const setFilmFavorite = props.setFilmFavorite;
   const deleteFilm = props.deleteFilm;
   const headers = props.headers;
   const films = props.films;
   const setFilmRating = props.setFilmRating;

   let pageContent;

   // check if the specified filter exist, otherwise return a blank page
   if (!filters.some(filter => filter === revertFromSnakeCase(activeFilter)))
      pageContent = <ErrorBox message="Error: please specify an existing filter" />;
   else
      pageContent =
         <Row className='h-100'>
            {/* sidebar */}
            <Col as="aside" className="bg-light col-3 p-4 h-100">
               <FiltersBox className="h-100" filters={filters} active={activeFilter} />
            </Col>

            {/* main content */}
            <Col className="col-9">
               <Container fluid>
                  <Row className="p-3 pt-4">
                     <h1>{revertFromSnakeCase(activeFilter)}</h1>
                  </Row>

                  <Row as="main" className="px-4">
                     <FilmTable setFilmFavorite={setFilmFavorite} setFilmRating={setFilmRating}
                        deleteFilm={deleteFilm} headers={headers} films={films} activeFilter={activeFilter} />
                  </Row>

                  <Row className="m-1">
                     <AddButton>+</AddButton>
                  </Row>
               </Container>
            </Col>
         </Row>;

   return (
      <>
         <Row as="header">
            <FilmLibraryNavbar />
         </Row>
         {pageContent}
      </>
   );
}

export default Home;