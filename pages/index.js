// importieren der erforderlichen module
import Head from 'next/head';
import axios from 'axios';
import { useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import { WiDaySunny, WiRain, WiSnow, WiCloud, WiFog, WiThunderstorm, WiShowers } from 'react-icons/wi';

function getWeatherIcon(weather) {
  switch (weather) {
    case 'Clear':
      return <WiDaySunny />;
    case 'Rain':
      return <WiRain />;
    case 'Snow':
      return <WiSnow />;
    case 'Clouds':
      return <WiCloud />;
    case 'Atmosphere':
      return <WiFog />;
    case 'Thunderstorm':
      return <WiThunderstorm />;
    case 'Drizzle':
      return <WiShowers />;
  }
}

// erstellen der funktion
export default function Home() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(false);
  const [tempInCelsius, setTempInCelsius] = useState('');
  const [buttonClicked, setButtonClicked] = useState(false);
  const [localTime, setLocalTime] = useState('');

  const currentWeatherCondition = weather.weather ? weather.weather[0].main : '';

// abrufen der wetterdaten
  const fetchWeather = (e) => {
    e.preventDefault();
    setLoading(true);
    setButtonClicked(true);


    const MY_WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${MY_WEATHER_API_KEY}`;

    axios
      .get(apiUrl)
      .then((response) => {
        setWeather(response.data);
        const weatherData = response.data;
        const tempCelsius = (weatherData.main.temp - 273.15).toFixed(2);
        setTempInCelsius(tempCelsius);
        const timezoneOffset = response.data.timezone; // Zeitzone der Stadt in Sekunden von UTC
        const date = new Date(); // Aktuelle Datum und Uhrzeit
        const localTime = new Date(date.getTime() + timezoneOffset * 1000); // Lokale Uhrzeit der Stadt
        setLocalTime(localTime.toLocaleTimeString()); // Setzen Sie den Zustand auf die lokale Uhrzeit der Stadt
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

// Aufbau der Webseite
  return (
    <div className="container">
  <Head>
    <title>weather-app</title>
    <meta name="description" content="Generated by create next app" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/icon.jpg" type="image/jpeg"/>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet"></link>
  </Head>
  {!buttonClicked && (
  <div className="header">
    <h1>Weather forecast</h1>
  </div>
  )}
  <div className='header icon'>
  {getWeatherIcon(currentWeatherCondition)}
  </div>
  <div>
    <form onSubmit={fetchWeather}>
      <input
        type="text"
        placeholder="enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button type="submit">
        <BsSearch />
      </button>
    </form>
  </div>
  {loading && <p>Loading...</p>}
  {weather.main && (
    <div className="weatherInfo">
      <h2>Weather in <span style={{ color: 'rgb(144, 86, 191)' }}>{weather.name}, {weather.sys.country}</span></h2>
      <p>temperature: <span style={{ color: 'rgb(144, 86, 191)' }}>{tempInCelsius}°C</span></p>
      <p>humidity: <span style={{ color: 'rgb(144, 86, 191)' }}>{weather.main.humidity}%</span></p>
      <p>cloud formation: <span style={{ color: 'rgb(144, 86, 191)' }}>{weather.weather[0].description}</span></p>
      <p>local time: <span style={{ color: 'rgb(144, 86, 191)' }}>{localTime}</span></p>
    </div>
  )}
</div>
  );
}