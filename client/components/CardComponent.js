import React from 'react';

const CardComponent = ({ image }) => {
  return (
    // <div className="card">
    //   <img src={image.url} alt={image.title} />
    //   <div className="card-body">
    //     <h5 className="card-title">{image.title}</h5>
    //     <p className="card-text">{image.description}</p>
    //   </div>
    // </div>
        <div className='col-4'>
          <div className='card h-100 shadow'>
            <div className='d-flex flex-column justify-content align-items-center'>
              <img
                src={image.url}
                className='img-fluid card-img-top'
              />
              <div className='card-body'>
                <h5 className='card-title'>{image.title}</h5>
                <p className='card-text'>{image.description}</p>
              </div>
            </div>
          </div>
        </div>
  );
};

export default CardComponent;
