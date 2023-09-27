import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardComponent from './CardComponent';
import { useNavigate } from 'react-router-dom';

const CardContainer = () => {
  const [images, setImages] = useState([]);

  const navigate = useNavigate();

  const handleClick = (event) => {
    let title;

    let parent = event.target.parentNode.childNodes;

    for (let i = 0; i < parent.length; i++) {
      const child = parent[i];
      if (child.className === 'card-title') title = child.innerText;
    }
    console.log(title)

    navigate(`/product/${title}`)

  }

  useEffect(() => {
    axios
      .get('http://localhost:3000/gallery') // Replace with the API endpoint pertaining to PostgreSQL
      .then((response) => {
        setImages(response.data);
        console.log('Response:', response.data);
      })
      .catch((error) => {
        console.error('Error fetching images:', error);
      });
  }, []);

  return (
    <>
      <div className='container'>
        <div className='row gy-3'>
          {images.map((image) => (
            <CardComponent key={image.id} image={image} click={handleClick} />
          ))}
        </div>
      </div>
    </>
  );
};

export default CardContainer;
