import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardComponent from './CardComponent';

const CardContainer = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    axios
      .get('/api/images') // Replace with the API endpoint pertaining to PostgreSQL
      .then((response) => {
        setImages(response.data);
      })
      .catch((error) => {
        console.error('Error fetching images:', error);
      });
  }, []);

  return (
    <>
      <h1>card container</h1>
      <div className='container'>
        <div className='row'>
          {images.map((image) => (
            <CardComponent key={image.id} image={image} />
          ))}
        </div>
      </div>
    </>
  );
};

export default CardContainer;
