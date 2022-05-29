import FilmHeadersRow from './FilmHeadersRow';
import FilmRows from './FilmRows'
import { Table } from 'react-bootstrap'


function FilmTable(props) {
   return (
      <Table hover className="mx-2" id="films-table">
         <thead>
            <FilmHeadersRow headers={props.headers} />
         </thead>

         <tbody>
            {props.loading ? <></> :
               <FilmRows setFilmFavorite={props.setFilmFavorite} setFilmRating={props.setFilmRating}
                  deleteFilm={props.deleteFilm} films={props.films}
                  key={`filter-${props.activeFilter}`} setLoading={props.setLoading} />
            }
         </tbody>

      </Table>
   );
}

export default FilmTable