const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();
app.use(cors({ origin: true }));

// const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true';
// console.log('USE_MOCK_DATA:', USE_MOCK_DATA); // Add this line at the top of your file
// const mockAPIurl =
//   'https://belaementa-apimockupdata-3f3cf48edfcd.herokuapp.com/restaurants';

const googlePlacesApiKey = process.env.GOOGLE_PLACES_API_KEY;
const placesAPIEndpoint =
  'https://maps.googleapis.com/maps/api/place/textsearch/json';

app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.path);
  next();
});

// Rout to get a list of restaurants based on the query parameter or a default query
app.get('/restaurants', async (req, res) => {
  try {
    // Retrieve the search query and page token from the query parameters
    // Default query is 'restaurants in Lisbon'
    const query = req.query.q || 'restaurants in Lisbon';
    const pageToken = req.query.pageToken || null;

    // Construct the API request URL with query and API key
    // If a page is provided, it is included in the URL to fetch the next page
    let url = `${placesAPIEndpoint}?query=${encodeURIComponent(
      query,
    )}&key=${googlePlacesApiKey}`;
    if (pageToken) {
      url += `&pagetoken=${encodeURIComponent(pageToken)}`;
    }

    const response = await axios.get(url);

    // Error handling, check response status
    if (response.data.status === 'INVALID_REQUEST') {
      return res
        .status(400)
        .send({ message: 'Invalid request. The page token may be invalid.' });
    }

    if (response.data.status !== 'OK') {
      return res
        .status(500)
        .send({ message: `Google Places API Error: ${response.data.status}` });
    }

    return res.json(response.data);
  } catch (err) {
    return res.status(500).send({ message: err.message, stack: err.stack });
  }
});

const placeDetailsEndpoint =
  'https://maps.googleapis.com/maps/api/place/details/json';

app.get('/restaurant/:restaurantID', async (req, res) => {
  try {
    // Get the restaurant id from the request
    const { restaurantID } = req.params;
    const url = `${placeDetailsEndpoint}?place_id=${restaurantID}&key=${googlePlacesApiKey}`;

    const response = await axios.get(url);
    return res.json(response.data);
  } catch (error) {
    console.error('Error fetching restaurant details: ', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

app.listen(port, () => {
  console.log('🚀 ~ file: server.js:24 ~ app.listen ~ PORT:', port);
});

module.exports = app;
