import { convertToSnakeCase } from "../../utilities";

function FilmHeadersRow(props) {

   const headersElements = props.headers.map(name => {
      const key = convertToSnakeCase(name);
      return <th scope="col" key={`${key}-header`}>{name}</th>;
   });

   return <tr>{headersElements}</tr>;
}

export default FilmHeadersRow;