import React from 'react';
import { useState } from 'react';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';

export function Upload() {
  const [image, setImage] = useState();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [artist, setArtist] = useState('');

  const getImg = (event) => {
    setImage(event.target.files[0]);
    console.log('local image', event.target.files[0]);
  };

  const getTitle = (event) => {
    setTitle(event.target.value);
    console.log(event.target.value);
  };

  const getDescription = (event) => {
    setDescription(event.target.value);
    console.log(event.target.value);
  };

  const getArtist = (event) => {
    setArtist(event.target.value);
    console.log(event.target.value);
  };

  const upload = async (event) => {
    event.preventDefault()
    console.log('upload function called')
    if (image === null) return;
    const imageRef = ref(storage, `images/${image.name + v4()}`);

    try {
      const response = await uploadBytes(imageRef, image);
      console.log('Image uploaded');
      const firebaseUrl = await getDownloadURL(response.ref);
      console.log(firebaseUrl)
      // setUrl(firebaseUrl);
      try {
        console.log(image, title, description)
        await fetch('http://localhost:3000/upload', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            image: image,
            title: title,
            description: description,
            artist: artist,
            url: firebaseUrl,
            userId: 2,
          }),
        });
      } catch (err) {
        console.log(err);
      }
      let inputs = document.querySelectorAll('input')
      console.log('node list',inputs);
      console.log('first field',inputs[1])
      inputs[1].value = ''
      inputs[2].value = ''
      inputs[3].value = ''


    } catch (err) {
      console.log('Error while uploading image to firebase:', err);
    }

    // endpoit /upload on port 3000
    // Object expected on server side
    //  const imgObj = {
    //   userId,
    //   title,
    //   description,
    //   url
    //  }
    // if (!url.length) {
    //   console.log('empty url', url)
    //   return;
    // }
    // try {
    //   await fetch('http://localhost:3000/upload', {
    //     method: 'POST',
    //     body: JSON.stringify({
    //       image: image,
    //       title: title,
    //       description: description,
    //       url: url,
    //       userId: 2,
    //     }),
    //   });
    // } catch (err) {
    //   console.log(err);
    // }
  };

  return (
    <div className='container d-flex align-items-center mt-5'>
      <div className='row'>
        <div className="col">
          <img src='https://cdn.dribbble.com/users/932465/screenshots/17128020/media/d2c9cf6dc135ca0d29832f504efe654c.png?resize=400x0' />
        </div>
        <div className='col'>
          <form>
            <h3>Submit your work</h3>
            <input
              className='form-control mb-3'
              type='file'
              onChange={getImg}
              accept='image/gif, image/jpeg, image/png'
            />
            <input
            className="form-control mb-3"
              type='text'
              onChange={getTitle}
              placeholder='Title of work'
            />
            <input
              className="form-control mb-3"
              type='text'
              onChange={getArtist}
              placeholder='Artist'
            />
            <input
              className="form-control mb-3"
              type='text'
              onChange={getDescription}
              placeholder='Description'
            />
            <div className='form-check mb-3'>
            <label className="form-check-label" for='original'>Original work?</label>
            <input type="checkbox" className="form-check-input" id='original'/>
            </div>
            <button className="btn btn-danger w-100" onClick={upload}>Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}
