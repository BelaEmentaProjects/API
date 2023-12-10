"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const port = process.env.PORT || 3000;
const app = express();
app.use(cors({ origin: true }));
const googlePlacesApiKey = process.env.GOOGLE_PLACES_API_KEY;
const placesAPIEndpoint = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
app.use((req, res, next, err) => {
    console.log('Incoming request:', req.method, req.path);
    if (err) {
        return res.status(500).send({ message: err.message, stack: err.stack });
    }
    next();
});
// Rout to get a list of restaurants based on the query parameter or a default query
app.get('/restaurants', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Retrieve the search query and page token from the query parameters
        // Default query is 'restaurants in Lisbon'
        const query = String(req.query.q || 'restaurants in Lisbon');
        const pageToken = req.query.pageToken
            ? String(req.query.pageToken)
            : null;
        // Construct the API request URL with query and API key
        // If a page is provided, it is included in the URL to fetch the next page
        let url = `${placesAPIEndpoint}?query=${encodeURIComponent(query)}&key=${googlePlacesApiKey}`;
        if (pageToken) {
            url += `&pagetoken=${encodeURIComponent(pageToken)}`;
        }
        const response = yield axios.get(url);
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
    }
    catch (err) {
        return res.status(500).send({ message: err.message, stack: err.stack });
    }
}));
const placeDetailsEndpoint = 'https://maps.googleapis.com/maps/api/place/details/json';
app.get('/restaurant/:restaurantID', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the restaurant id from the request
        const { restaurantID } = req.params;
        const url = `${placeDetailsEndpoint}?place_id=${restaurantID}&key=${googlePlacesApiKey}`;
        const response = yield axios.get(url);
        return res.json(response.data);
    }
    catch (err) {
        console.error('Error fetching restaurant details: ', err);
        res.status(500).json({ err: 'Server Error' });
    }
}));
app.listen(port, () => {
    console.log('🚀 ~ file: server.js:24 ~ app.listen ~ PORT:', port);
});
module.exports = app;
