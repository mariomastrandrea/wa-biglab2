import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useEffect } from 'react';
import { useParams } from "react-router-dom";
import { revertFromSnakeCase } from "../utilities.js"
import FiltersBox from '../components/FiltersBox';
import AddButton from '../components/AddButton';
import ErrorBox from '../components/ErrorBox';
import FilmTable from '../components/filmComponents/FilmTable';
import FilmLibraryNavbar from '../components/filmComponents/FilmLibraryNavbar.js';
import SpinnerBox from '../components/SpinnerBox.js';


function Home(props) {
   const param = useParams();

   const {
      loading, setLoading,
      errorMessage, setErrorMessage,
      filters, headers,
      getFilmsFilteredBy,
      films, deleteFilm,
      setFilmRating, setFilmFavorite
   } = props;

   const activeFilter = props.activeFilter || param.activeFilter?.toLowerCase();

   useEffect(() => {
      setLoading(true);


      getFilmsFilteredBy(activeFilter).then(() => setLoading(false)).catch(() => {
         setErrorMessage("An error occurred retrieving films from the server");
         setLoading(false);
      });


      // eslint-disable-next-line
   }, [activeFilter]);

   let pageContent;

   // check if the specified filter exist, otherwise return a blank page
   if (!filters.some(filter => filter === revertFromSnakeCase(activeFilter)))
      pageContent = <ErrorBox message="Error: please specify an existing filter" />;
   else
      pageContent =
         <Row className='h-100'>
            {/* sidebar */}
            <Col as="aside" className="bg-light col-3 p-4 h-100">
               <FiltersBox className="h-100" filters={filters} active={activeFilter} setErrorMessage={setErrorMessage} />
            </Col>

            {/* main content */}
            <Col className="col-9">
               <Container fluid>
                  <Row className="p-3 pt-4">
                     <h1>{revertFromSnakeCase(activeFilter)}</h1>
                  </Row>

                  {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

                  <Row as="main" className="px-4">
                     <FilmTable setFilmFavorite={setFilmFavorite} setFilmRating={setFilmRating} loading={loading}
                        deleteFilm={deleteFilm} headers={headers} films={films} activeFilter={activeFilter} setLoading={setLoading} />
                  </Row>

                  {loading ? <SpinnerBox /> : <></>}

                  <Row className="m-1">
                     <AddButton>+</AddButton>
                  </Row>
               </Container>
            </Col>
         </Row>;

   return (
      <>
         <Row as="header">
            <FilmLibraryNavbar setLoading={setLoading} setErrorMessage={setErrorMessage} />
         </Row>
         {pageContent}
      </>
   );
}

export default Home;