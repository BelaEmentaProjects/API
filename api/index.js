const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();
app.use(cors());

const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true';
console.log('USE_MOCK_DATA:', USE_MOCK_DATA); // Add this line at the top of your file
const mockAPIurl =
  'https://belaementa-apimockupdata-3f3cf48edfcd.herokuapp.com/restaurants';
const realAPIurl = 'https://worldwide-restaurants.p.rapidapi.com/search';

const encodedParams = new URLSearchParams();
encodedParams.set('language', 'en_US');
encodedParams.set('location_id', '297704');
encodedParams.set('currency', 'EUR');
encodedParams.set('offset', '0');

// https://rapidapi.com/ptwebsolution/api/worldwide-restaurants

app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.path);
  next();
});

app.get('/restaurants', async (req, res) => {
  try {
    const url = USE_MOCK_DATA ? mockAPIurl : realAPIurl;

    if (USE_MOCK_DATA) {
      const response = await axios.get(url);
      console.log('Mock data response:', response.data);
      return res.json(response.data);
    }

    const options = {
      method: 'POST',
      url: realAPIurl,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'worldwide-restaurants.p.rapidapi.com',
      },
      data: encodedParams.toString(),
    };

    const postResponse = await axios.request(options);
    console.log('POST response data:', postResponse.data);
    console.log('Location header:', postResponse.headers.location);

    const getResponse = await axios.get(postResponse.headers.location);
    console.log('GET response data:', getResponse.data);

    return res.json(getResponse.data);
  } catch (err) {
    console.error('Error in /restaurants:', err);
    return res.status(500).send({ message: err.message, stack: err.stack });
  }
});

// app.get('/restaurants/:id', async (req, res) => {
//   try {
//     // Get the restaurant id from the request
//     const { id } = req.params;

//     // Update the data payload to include the restaurant id
//     encodedParams.set('location_id', id);

//     // Make the API request to fetch the restaurant details
//     const response = await axios.request({
//       ...options,
//       data: encodedParams.toString(),
//     });
//     // Send the restaurant details in the response
//     res.json(response.data);
//   } catch (error) {
//     console.error('Error fetching restaurant details: ', error);
//     res.status(500).json({ error: 'Server Error' });
//   }
// });

app.listen(port, () => {
  console.log('🚀 ~ file: server.js:24 ~ app.listen ~ PORT:', port);
});

module.exports = app;
