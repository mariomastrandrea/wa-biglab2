import { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { Film } from '../../FilmLibrary'

function FilmForm(props) {
   const defaultValues = {
      id: props.film ? props.film.id : '',
      title: props.film ? props.film.title : '',
      favorite: props.film ? props.film.favorite : false,
      watchdate: props.film ?
         (props.film.watchdate ? props.film.watchdate.format("YYYY-MM-DD") : '')
         : '',
      rating: props.film ? (props.film.rating ?? 0) : 0
   }

   const [id, setId] = useState(defaultValues['id']);
   const [title, setTitle] = useState(defaultValues['title']);
   const [favorite, setFavorite] = useState(defaultValues['favorite']);
   const [watchdate, setWatchdate] = useState(defaultValues['watchdate']);
   const [rating, setRating] = useState(defaultValues['rating']);
   const navigate = useNavigate();

   const handleSubmit = (event) => {
      event.preventDefault();
      const newFilm = new Film(id, title, favorite, watchdate, rating);

      if (props.film) /* edit mode */
         props.editFilm(newFilm);
      else            /* add mode */
         props.addFilm(newFilm);

      navigate("/");
   }

   const handleCancel = () => {
      setId(defaultValues['id']);
      setTitle(defaultValues['title']);
      setFavorite(defaultValues['favorite']);
      setWatchdate(defaultValues['watchdate']);
      setRating(defaultValues['rating']);
   }

   return (
      <>
         <Row className="mt-3">
            <Col></Col>
            <Col as="main" xs={5} className='my-2 p-2'>
               <div style={{ borderColor: 'grey', borderWidth: 2, borderStyle: 'dotted', 
                  borderRadius: 10, padding: '0.5em 1.75em' }}>
                  <Form onSubmit={handleSubmit}>
                     <Form.Group className='my-3'>
                        <Form.Label>Id</Form.Label>
                        <Form.Control type="text" value={id} required={true} placeholder="Film Id"
                           onChange={(event) => { setId(event.target.value) }}></Form.Control>
                     </Form.Group>

                     <Form.Group className='my-3'>
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" value={title} required={true} placeholder="Film Title"
                           onChange={(event) => { setTitle(event.target.value) }}></Form.Control>
                     </Form.Group>

                     <Form.Group className='my-3'>
                        <Form.Label>Favorite</Form.Label>
                        <Form.Check type="checkbox" className="form-check-inline ms-2" checked={favorite}
                           required={false} onChange={(event) => { setFavorite(event.target.checked) }}></Form.Check>
                     </Form.Group>

                     <Form.Group className='my-3'>
                        <Form.Label>Watchdate</Form.Label>
                        <Form.Control type="date" value={watchdate}
                           onChange={(event) => { setWatchdate(event.target.value) }}></Form.Control>
                     </Form.Group>

                     <Form.Group className='my-3'>
                        <Form.Label>Rating</Form.Label>
                        <Form.Control type="number" value={rating} required={false}
                           onChange={(event) => { setRating(event.target.value) }} min={0} max={5}></Form.Control>
                     </Form.Group>

                     <Form.Group className='my-4' align="right">
                        <Button variant='outline-warning' onClick={handleCancel} className="me-1 mt-2">Cancel</Button>
                        <Button variant='outline-success' type="submit" className="ms-1 mt-2">Confirm</Button>
                     </Form.Group>
                  </Form>
               </div>
            </Col>
            <Col></Col>
         </Row>
      </>
   );
}

export default FilmForm