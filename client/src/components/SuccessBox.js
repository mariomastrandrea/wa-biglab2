import { Row, Col, Alert } from 'react-bootstrap';

function SuccessBox(props) {
   return (
      <Row className='mt-2 mx-2'>
         <Col>
            <Alert key='success' variant='success'>{props.children}</Alert>
         </Col>
      </Row>
   );
}

export default SuccessBox;