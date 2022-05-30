import FilmHeadersRow from './FilmHeadersRow';
import FilmRows from './FilmRows'
import { Table } from 'react-bootstrap'


function FilmTable(props) {
   const {
      loading, setFilmFavorite, 
      setFilmRating, deleteFilm, 
      films, activeFilter,
      setLoading, headers,
      setSuccessMessage, setErrorMessage
   } = props;

   return (
      <Table hover className="mx-2" id="films-table">
         <thead>
            <FilmHeadersRow headers={headers} />
         </thead>

         <tbody>
            {(loading && !films) ? <></> :
               <FilmRows setFilmFavorite={setFilmFavorite} setFilmRating={setFilmRating}
                  deleteFilm={deleteFilm} films={films} activeFilter={activeFilter}
                  setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage}
                  key={`filter-${activeFilter}`} setLoading={setLoading} loading={loading} />
            }
         </tbody>

      </Table>
   );
}

export default FilmTable