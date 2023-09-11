const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();
app.use(cors());

const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true';

const encodedParams = new URLSearchParams();
encodedParams.set('language', 'en_US');
encodedParams.set('location_id', '297704');
encodedParams.set('currency', 'EUR');
encodedParams.set('offset', '0');

// https://rapidapi.com/ptwebsolution/api/worldwide-restaurants

const options = {
  method: 'POST',
  url: USE_MOCK_DATA
    ? 'http://localhost:3001/results'
    : 'https://worldwide-restaurants.p.rapidapi.com/search',
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'worldwide-restaurants.p.rapidapi.com',
  },
  data: encodedParams.toString(),
};

app.get('/restaurants', async (req, res) => {
  try {
    const url = USE_MOCK_DATA
      ? 'http://localhost:3001/results'
      : 'https://worldwide-restaurants.p.rapidapi.com/search';

    // If using mock data, directly fetch the data from the mock server
    if (USE_MOCK_DATA) {
      const response = await axios.get(url);
      res.json(response.data);
    }

    // If not using mock data, first make a POST request to create the data followed by a GET request to retrieve the data.
    const postResponse = await axios.request(options);
    const getResponse = await axios.get(postResponse.headers.location);
    res.json(getResponse.data);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

app.get('/restaurants/:id', async (req, res) => {
  try {
    // Get the restaurant id from the request
    const { id } = req.params;

    // Update the data payload to include the restaurant id
    encodedParams.set('location_id', id);

    // Make the API request to fetch the restaurant details
    const response = await axios.request({
      ...options,
      data: encodedParams.toString(),
    });
    // Send the restaurant details in the response
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching restaurant details: ', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

app.listen(port, () => {
  console.log('🚀 ~ file: server.js:24 ~ app.listen ~ PORT:', port);
});
