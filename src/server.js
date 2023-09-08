const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const { PORT } = process.env;
const app = express();
app.use(cors());

const encodedParams = new URLSearchParams();
encodedParams.set('language', 'en_US');
encodedParams.set('location_id', '297704');
encodedParams.set('currency', 'EUR');
encodedParams.set('offset', '0');

const options = {
  method: 'POST',
  url: 'https://worldwide-restaurants.p.rapidapi.com/search',
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'worldwide-restaurants.p.rapidapi.com',
  },
  data: encodedParams.toString(),
};

app.get('/restaurants', async (req, res) => {
  try {
    const response = await axios.request(options);
    try {
      res.json(response.data);
    } catch (err) {
      console.log('🚀 ~ file: server.js:37 ~ app.get ~ err:', err);
      res.status(500).send('Server Error');
    }
  } catch (error) {
    if (error.response) {
      // Request made and server responded
      console.log(
        '🚀 ~ file: server.js:34 ~ app.get ~ error.response.headers:',
        error.response.headers,
      );
      console.log(
        '🚀 ~ file: server.js:34 ~ app.get ~ error.response.status:',
        error.response.status,
      );
      console.log(
        '🚀 ~ file: server.js:34 ~ app.get ~ error.response.data:',
        error.response.data,
      );
    } else if (error.request) {
      // The request was made but no response was received
      console.log(
        '🚀 ~ file: server.js:48 ~ app.get ~ error.request;:',
        error.request,
      );
      res.status(500).json({ error: 'No response from server' });
    } else {
      res.status(500).json({ error: 'Server Error' });
      console.log('🚀 ~ file: server.js:6 ~ app.get ~ error:', error);
    }
  }
});

app.listen(PORT, () => {
  console.log('🚀 ~ file: server.js:24 ~ app.listen ~ PORT:', PORT);
});
