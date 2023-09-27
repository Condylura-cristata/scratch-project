// IMPORTS AND REQUIREMENTS ================================
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

// AUTH STORAGE: Stretch: Add to an env
const accessTokenSecret = '24c9e42fcac060838120f07ea5460b4c6f8c4b7c137a23c4035a93c594f0b4dd1d932b0e95eeb0422066daa3e521c6353b4f858893a3b80343ab3271d7d79198';
const refreshTokenSecret = '16376af783e470b0faf0eafafe36350ca5ec5fff9979bc34397906bfe2bfc53bbb030dc6cceb17285f56bd379ffef9251b3e993e5d6637a8e7c63e7acefe1f81';

// OBJ TO ADD MIDDLEWARE METHODS TO =========================
const authController = {};

// HELPER FUNCTIONS ========================================
async function createUser(username, password) {
  const insertQuery = 'INSERT INTO users (username, password) VALUES ($1, $2)';
  return await db.query(insertQuery, [username, password]);
}

async function checkIfUserExists(username) {
  const query = `SELECT * FROM users WHERE username = '${username}'`;
  const result = await db.query(query);
  if (result.rows.length > 0) {
    console.log('User with the provided username exists');
    return true;
  } else {
    console.log('User with the provided username does not exist');
    return false;
  }
}

async function checkIfInputMatches(username, password) {
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  const result = await db.query(query);
  if (result.rows.length > 0) {
    console.log('Found user which matches the provided username and password');
    return true;
  } else {
    console.log('User with the provided username and password does not exist');
    return false;
  }
}

// METHODS ==================================================

authController.signup = async function (req, res, next) {
  // Destructure request body
  // Sanitize input by verifying each expected param exists on request
  // Sanitize input by verifying typeof each param on request
  try {
    const userExists = await checkIfUserExists(req.body.username);
    if (!userExists) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      await createUser(req.body.username, hashedPassword);
      console.log('Creating user');
    } else {
      console.log('Will not create user');
    }
    return next();
  } catch (error) {
    // Match shape of error to shape of error on server.js
    console.log('error in AuthController.signup', error);
    return next(error);
  }
}

authController.login = async function (req, res, next) {
  // Destructure request body
  // Sanitize input by verifying each expected param exists on request
  // Sanitize input by verifying typeof each param on request
  try {
    // await matchFound passing in req.body.username and req.body.password
    const matchFound = await checkIfInputMatches(req.body.username, req.body.password);
    if (!matchFound) {
      res.locals.loginAttempt = 'User denied access: Username or password invalid';
    } else {
      res.locals.loginAttempt = "User logging in";
      // res.redirect('dashboard'); // Q: What are we calling this?
    }
    return next();
  } catch (error) {
    // Match shape of error to shape of error on server.js
    console.log('error in AuthController.login', error);
    return next(error)
  }
};

authController.hashedLogin = async function (req, res, next) {
  const { username, password } = req.body;
  try {
    const user = await db.query(`SELECT * FROM users WHERE username = '${username}'`);
    if (user) {
      const match = await bcrypt.compare(password, user.rows[0].password);
      console.log('match', match)
      if (match) {
        console.log('Hashed login successful');
        res.locals.loginAttempt = 'Hashed login successful';
        // JWT
        const accessToken = jwt.sign(
          {
            "UserInfo": {
              "username": user.username,
              "roles": user.roles
            }
          },
          accessTokenSecret,
          { expiresIn: '180s'}
        )

        const refreshToken = jwt.sign(
          {
            "UserInfo": {
              "username": user.username,
              "roles": user.roles
            }
          },
          refreshTokenSecret,
          { expiresIn: '300s'}
        )
        res.cookie('jwt', refreshToken, {
          httpOnly: true, // Only accessible by a web server
          secure: true, //https
          sameSite: 'None',
          maxAge: 5 * 60 * 1000
        })

        res.locals.accessToken = accessToken;

      } else {
        console.log('Invalid password');
        res.locals.loginAttempt = 'Invalid username or password';
      }
      return next();
    } else {
      console.log('User not found');
      res.locals.loginAttempt = 'Invalid username or password';
      return next();
    }
  } catch (error) {
    console.error('Error during user login:', error);
    return next(error);
  }
}


// Does not actually refresh - is that by design?
authController.refresh = async function (req, res, next) {
  const { username, password } = req.body;
  const cookies = req.cookies;

  if (!cookies.jwt) return res.status(401).json({message:' JWT not provided, has expired, or is missing'});

  const refreshToken = cookies.jwt;
  console.log('refreshToken:', refreshToken);

  try {
    console.log('Issuing refresh token')
    const decoded = jwt.verify(refreshToken, refreshTokenSecret);

    const newAccessToken = jwt.sign(
      {
        "UserInfo": {
          "username": decoded.username,
          "roles": decoded.roles
        }
      },
      accessTokenSecret,
      {expiresIn: '180s'}
    );
    res.locals.accessToken = newAccessToken;
    return next();
  } catch (error) {
    console.log('Error during token refresh', error);
    return next(error);
  }
}

authController.logout = async function (req, res, next) {
  const cookies = req.cookies;
  try {
    if (!cookies?.jwt) return res.sendStatus(204);
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true})
    res.json({message: 'Cookie cleared'})
  } catch (error) {
    console.log('Error during logout', error);
    return next(error);
  }
}

module.exports = authController;