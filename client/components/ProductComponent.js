import React from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';

const ProductComponent = () => {
  const [images, setImages] = useState({});

  const location = useLocation();
  let title = location.pathname.slice(9).replaceAll('%20', ' ');
  console.log(title);

  useEffect(() => {
    axios
      .get('http://localhost:3000/gallery') // Replace with the API endpoint pertaining to PostgreSQL
      .then((response) => {
        setImages(
          response.data.filter((obj) => {
            return obj.title === title;
          })[0]
        );
        console.log('Response:', response.data);
      })
      .catch((error) => {
        console.error('Error fetching images:', error);
      });
  }, []);

  return (
    <>
      {'title' in images ? (
        <div className='container'>
          <div className='row'>
            <div className='col'>
              <img src={images.url} className='img-fluid' />
            </div>
            <div className='col'>
            <h1>{images.title}</h1>
            <p className="artist">Artist: {images.artist}</p>
            <p className="description">{images.description}</p>
            <button className='btn btn-sm btn-outline-danger'>Contact</button>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default ProductComponent;
