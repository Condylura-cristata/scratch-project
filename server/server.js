const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;
const authRouter = require('./routers/authRouter');
const galleryRouter = require('./routers/galleryRouter');
const cors = require('cors')
const bodyParser = require('body-parser');

app.use(express.json());
app.use(cors())
app.use(bodyParser.json())
// Define auth route handler
app.use('/auth',
  (req, res, next) => {
    console.log('routed to /auth');
    return next();
  },
  authRouter
);

app.use('/gallery', galleryRouter, (req, res)=> {
  res.status(200).json(res.locals.images)
});

app.use('/upload', galleryRouter, (req, res)=> {
  res.status(200).json(res.locals.newImage)
});

app.use((req,res) => {
  res.status(404).send('Not found.')
});

// Error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error.',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})

module.exports = app;
