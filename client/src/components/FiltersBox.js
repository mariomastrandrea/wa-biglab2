import { ListGroup } from "react-bootstrap"
import { useNavigate } from "react-router-dom";
import { convertToSnakeCase } from "../utilities.js";

function FiltersBox(props) {
   const navigate = useNavigate();

   const filtersElements = props.filters.map(name => {
      const key = convertToSnakeCase(name);

      return (
         <ListGroup.Item key={`${key}-filter`} active={props.active === key}
            action={props.active !== name} onClick={() => navigate(`/${key}`)}>
            {name}
         </ListGroup.Item>
      );
   });

   return (
      <ListGroup className={props.className}>
         {filtersElements}
      </ListGroup>
   );
}

export default FiltersBox;