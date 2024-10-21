import express from "express"
import axios from "axios"
import path from "path"
import { fileURLToPath } from 'url';

const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'views'))

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', { forecast: null, error: null });
});

app.get('/weather', async (req, res) => {
    const city = req.query.city;
    const apiKey = 'e6001eaf04f610f4a540944d8d684c68'

    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        const weatherData = response.data;

        const willRain = weatherData.weather.some(weather => weather.main.toLowerCase() === 'rain');
        const forecast = willRain ? `it will rain tomorrow in ${city}.` : `it will not rain tomorrow in ${city}.`;

        res.render('index', { forecast, error: null });

    } catch (error) {
        res.render('index', {forecast: null, error:'city not found :/'})
    }
})

// Server Setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});