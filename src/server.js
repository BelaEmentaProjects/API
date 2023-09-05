const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const { PORT } = process.env;

app.get('/', async (req, res) => {
  // try {
  //   const response = await axios.get('API_ENDPOINT', {
  //     header: {
  //       'Authorization': `Bearer ${process.env.API_KEY}`
  //     }
  //   });
  //   res.json(response.data);

  // } catch (error) {
  //   res.status(500).json({ error: 'Server Error' });
  //   console.log("🚀 ~ file: server.js:6 ~ app.get ~ error:", error)
  // }
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log('🚀 ~ file: server.js:24 ~ app.listen ~ PORT:', PORT);
});
