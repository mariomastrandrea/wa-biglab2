import { Button, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function AddButton(props) {
   const navigate = useNavigate();

   return (
      <Col className="d-flex flex-row-reverse me-4 mt-3">
         <Button onClick={() => navigate("/addFilm")} className="circular-button">
            {props.children}
         </Button>
      </Col>
   );
}

export default AddButton;