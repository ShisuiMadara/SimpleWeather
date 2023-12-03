const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const API_KEY = process.env.WeatherAPI;
const weatherAPI = 'https://api.weatherapi.com/v1/current.json';

async function getWeatherForCity(city) {
  try {
    const response = await axios.get(`${weatherAPI}?key=${API_KEY}&q=${city}`);
    return response.data.current.temp_c + 'C'; // Assuming the temperature is returned in Celsius
  } catch (error) {
    console.error('Error fetching weather:', error);
    return 'N/A';
  }
}

// POST endpoint to get weather for multiple cities
app.post('/getWeather', async (req, res) => {
  const { cities } = req.body;
  if (!cities || !Array.isArray(cities)) {
    return res.status(400).json({ error: 'Invalid input format' });
  }

  try {
    const weatherData = {};
    for (const city of cities) {
      weatherData[city] = await getWeatherForCity(city);
    }
    res.json({ weather: weatherData });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
