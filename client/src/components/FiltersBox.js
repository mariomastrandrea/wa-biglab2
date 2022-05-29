import { ListGroup } from "react-bootstrap"
import { useNavigate } from "react-router-dom";
import { convertToSnakeCase } from "../utilities.js";

function FiltersBox(props) {
   const navigate = useNavigate();
   const { setErrorMessage, setSuccessMessage, active, className } = props;

   const handleChangeFilter = (key) => {
      setErrorMessage(""); // clear error message
      setSuccessMessage("");
      navigate(`/${key}`);
   };

   const filtersElements = props.filters.map(name => {
      const key = convertToSnakeCase(name);

      return (
         <ListGroup.Item key={`${key}-filter`} active={active === key}
            action={active !== name} onClick={() => handleChangeFilter(key)}>
               {name}
         </ListGroup.Item>
      );
   });

   return (
      <ListGroup className={className}>
         {filtersElements}
      </ListGroup>
   );
}

export default FiltersBox;