const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const cookieParser = require('cookie-parser');

router.use(cookieParser());

// POST REQUEST TO SIGN-UP, DATABASE MIDDLEWARE
router.post('/signup',
  (req, res, next) => {
    console.log('routed to /signup');
    return next();
  },
  authController.signup, (req, res) =>{
  res.sendStatus(200);
});

// POST REQUEST TO LOG IN, DATABASE MIDDLEWARE
router.post('/login',
  (req, res, next) => {
    console.log('routed to /login');
    return next();
  },
  authController.login, (req, res) => {
  res.status(200).json(res.locals.loginAttempt);
});

// POST REQUEST TO HASHED LOGIN
router.post('/hashedLogin',
  (req, res, next) => {
    console.log('routed to /hashedLogin');
    return next();
  },
  authController.hashedLogin, (req, res) => {
  res.status(200).json(res.locals);
});

// // POST REQUEST TO REFRESH
router.post('/refresh',
  (req, res, next) => {
    console.log('routed to /refresh');
    return next();
  },
  authController.refresh, (req, res) => {
  res.status(200).json(res.locals);
});


// // POST REQUEST TO LOGOUT
router.post('/logout',
  (req, res, next) => {
    console.log('routed to /logout');
    return next();
  },
  authController.logout, (req, res) => {
  res.status(200).json(res.locals);
});


module.exports = router;