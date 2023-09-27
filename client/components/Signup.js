import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'

export function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

const navigate = useNavigate()

  const getUsername = (event) => {
    setUsername(event.target.value);
    console.log(event.target.value);
  };

  const getPassword = (event) => {
    setPassword(event.target.value);
  };

  const signup = async () => {
    console.log('signup called');
    try {
      const response = await fetch('http://localhost:3000/auth/signup', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password }),
      });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className='container d-flex justify-content-center align-items-center mt-5'>
        <div className='row border border-2 rounded-3 shadow'>
          <div className='col'>
            <img
              src='https://media.istockphoto.com/id/916731506/vector/cover-your-eyes-with-both-hands.jpg?s=612x612&w=0&k=20&c=C6EANocmn8thIaLGEfvcy3gGsdgqkUlLcELGloEC1GQ='
              style={{ width: 600 }}
              className='img-fluid border rounded-3 m-2'
            />
          </div>
          <div className='col p-3 align-items-center'>
            <h3 className='mb-3'>The Art Gallery</h3>
            <h6>Sign up</h6>
            <div className='form-floating'>
              <input
                className='form-control mb-2'
                onChange={getUsername}
                type='text'
                placeholder='Username'
                id='username'
              />
              <label htmlFor='username'>Username</label>
            </div>
            <div className='form-floating'>
              <input
                className='form-control mb-3'
                onChange={getPassword}
                type='password'
                placeholder='Password'
                id='password'
              />
              <label htmlFor='password'>Password</label>
            </div>
            <button onClick={signup} className='btn btn-primary w-100 mb-2'>Sign up</button>
            <p>
              Already have an account? <a href='#' onClick={()=> navigate('/')} >Log in</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
