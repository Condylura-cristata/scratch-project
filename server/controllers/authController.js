// IMPORTS AND REQUIREMENTS ================================
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const signup = require('./authMiddleware/signup');
const login = require('./authMiddleware/login');

// AUTH STORAGE: Stretch: Add to an env
const accessTokenSecret =
  '24c9e42fcac060838120f07ea5460b4c6f8c4b7c137a23c4035a93c594f0b4dd1d932b0e95eeb0422066daa3e521c6353b4f858893a3b80343ab3271d7d79198';
const refreshTokenSecret =
  '16376af783e470b0faf0eafafe36350ca5ec5fff9979bc34397906bfe2bfc53bbb030dc6cceb17285f56bd379ffef9251b3e993e5d6637a8e7c63e7acefe1f81';

// OBJ TO ADD MIDDLEWARE METHODS TO =========================
const authController = {
  signup,
  login,
};

// HELPER FUNCTIONS ========================================

// METHODS ==================================================

authController.hashedLogin = async function (req, res, next) {
  const { username, password } = req.body;
  try {
    const user = await db.query(
      `SELECT * FROM users WHERE username = '${username}'`,
    );
    if (user) {
      const match = await bcrypt.compare(password, user.rows[0].password);
      console.log('match', match);
      if (match) {
        console.log('Hashed login successful');
        res.locals.loginAttempt = 'Hashed login successful';
        // JWT
        const accessToken = jwt.sign(
          {
            UserInfo: {
              username: user.username,
              roles: user.roles,
            },
          },
          accessTokenSecret,
          { expiresIn: '180s' },
        );

        const refreshToken = jwt.sign(
          {
            UserInfo: {
              username: user.username,
              roles: user.roles,
            },
          },
          refreshTokenSecret,
          { expiresIn: '300s' },
        );
        res.cookie('jwt', refreshToken, {
          httpOnly: true, // Only accessible by a web server
          secure: true, //https
          sameSite: 'None',
          maxAge: 5 * 60 * 1000,
        });

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
};

// Does not actually refresh - is that by design?
authController.refresh = async function (req, res, next) {
  const { username, password } = req.body;
  const cookies = req.cookies;

  if (!cookies.jwt)
    return res
      .status(401)
      .json({ message: ' JWT not provided, has expired, or is missing' });

  const refreshToken = cookies.jwt;
  console.log('refreshToken:', refreshToken);

  try {
    console.log('Issuing refresh token');
    const decoded = jwt.verify(refreshToken, refreshTokenSecret);

    const newAccessToken = jwt.sign(
      {
        UserInfo: {
          username: decoded.username,
          roles: decoded.roles,
        },
      },
      accessTokenSecret,
      { expiresIn: '180s' },
    );
    res.locals.accessToken = newAccessToken;
    return next();
  } catch (error) {
    console.log('Error during token refresh', error);
    return next(error);
  }
};

authController.logout = async function (req, res, next) {
  const cookies = req.cookies;
  try {
    if (!cookies?.jwt) return res.sendStatus(204);
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.json({ message: 'Cookie cleared' });
  } catch (error) {
    console.log('Error during logout', error);
    return next(error);
  }
};

module.exports = authController;
