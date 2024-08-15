import React, { useState, useEffect, useCallback } from 'react';
import '../App.css';
import EarthAnimation from '../Assets/gif/EarthAmimation.gif';
import LoadingAnimation from '../Assets/gif/loading.gif';
import ErrorAnimation from '../Assets/gif/Error.gif';
import ClearSkyDay from '../Assets/images/BackgroundsWeather/ClearSkyday.jpg';
import ClearSkyNight from '../Assets/images/BackgroundsWeather/ClearSkyNight.jpg';
import FewCloudsDay from '../Assets/images/BackgroundsWeather/fewCloudsday.jpg';
import FewCloudsNight from '../Assets/images/BackgroundsWeather/FewCloudsNight.jpg';
import ScratedCloudsDay from '../Assets/images/BackgroundsWeather/ScatteredCloudsDay.jpg';
import ScratedCloudsNight from '../Assets/images/BackgroundsWeather/Scrated CloudsNight.jpg';
import BrokenCloudsDay from '../Assets/images/BackgroundsWeather/brokenCloudsDay.jpg';
import BrokenCloudsNight from '../Assets/images/BackgroundsWeather/BrokenCloudsNight.jpg';
import ShowerRainDay from '../Assets/images/BackgroundsWeather/ShowerRainDay.jpg';
import ShowerRainNight from '../Assets/images/BackgroundsWeather/ShowerRainNight.jpg';
import RainDay from '../Assets/images/BackgroundsWeather/RainDay.jpg';
import RainNight from '../Assets/images/BackgroundsWeather/RainNight.jpg';
import ThunderstormDay from '../Assets/images/BackgroundsWeather/ThundersTormDay.jpg';
import ThunderstormNight from '../Assets/images/BackgroundsWeather/ThunderstomNight.jpg';
import SnowDay from '../Assets/images/BackgroundsWeather/SnowDay.jpg';
import SnowNight from '../Assets/images/BackgroundsWeather/SnowNight.jpg';
import MistDay from '../Assets/images/BackgroundsWeather/MistDay.jpg';
import MistNight from '../Assets/images/BackgroundsWeather/MistNight.jpg';
import { FaSearch } from "react-icons/fa";
import { MdMyLocation } from "react-icons/md";
import DateTime from './DateTime';
import axios from 'axios';

export default function WeatherApp() {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const backgroundImages = {
    '01d': ClearSkyDay, // clear day
    '01n': ClearSkyNight, // clear night
    '02d': FewCloudsDay, // few clouds day
    '02n': FewCloudsNight, // few clouds night
    '03d': ScratedCloudsDay, // scattered clouds day
    '03n': ScratedCloudsNight, // scattered clouds night
    '04d': BrokenCloudsDay, // broken clouds day
    '04n': BrokenCloudsNight, // broken clouds night
    '09d': ShowerRainDay, // shower rain day
    '09n': ShowerRainNight, // shower rain night
    '10d': RainDay, // rain day
    '10n': RainNight, // rain night
    '11d': ThunderstormDay, // thunderstorm day
    '11n': ThunderstormNight, // thunderstorm night
    '13d': SnowDay, // snow day
    '13n': SnowNight, // snow night
    '50d': MistDay, // mist day
    '50n': MistNight, // mist night
  };

  const fetchWeather = useCallback((location) => {
    if (!location) return;

    setLoading(true);
    setError(false);

    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=221a3684f275c49eba9697b039e6d43c`,
      headers: {}
    };

    axios.request(config)
      .then((response) => {
        console.log(response.data);
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setData(null);
        setLoading(false);
        setError(true);
      });
  }, []);

  const searchLocation = (e) => {
    if (e.key === "Enter") {
      fetchWeather(location);
    }
  };

  const WeatherIcons = ({ iconCode }) => {
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    return <img className='IconWeather' src={iconUrl} alt="Weather Icon" />;
  };

  const currentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLoading(true);

          const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=221a3684f275c49eba9697b039e6d43c`,
            headers: {}
          };

          axios.request(config)
            .then((response) => {
              console.log(response.data);
              setData(response.data);
              setLoading(false);
              setError(false);
            })
            .catch((error) => {
              console.log(error);
              setLoading(false);
              setError(true);
            });
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    // Effect logic here
  }, [fetchWeather, location]);

  const getBackgroundImage = () => {
    if (data && data.weather && data.weather[0].icon) {
      return backgroundImages[data.weather[0].icon] || backgroundImages[''];
    }
    return backgroundImages[''];
  };

  return (
    <>
      <div className="WeatherAppContainer"> 
        <div className="WeatherApp">
          <div className="WeatherImage"
            style={{
              backgroundImage: loading || error ? 'none' : `url(${getBackgroundImage()})`
            }}  
          >
            <h1>{data ? data.name : 'Your City'}
              <br />
              {data ? data.sys.country : 'IN'}
            </h1>
            <DateTime temperature={data ? `${data.main.temp}°c` : ''} />
          </div>
          <div className='Weather'>
            <div className="iconsWeather">
              {data ? <WeatherIcons iconCode={data.weather[0].icon} /> : <img src={EarthAnimation} className='IconWeather' alt="Earth Animation" />}
              <h3>{data ? data.weather[0].description : ''}</h3>
              <hr />
              <div className="WeatherLocation">
                <input
                  type="text"
                  placeholder='Search Any City'
                  value={location}
                  onKeyPress={searchLocation}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <div className="Icons">
                  <div className="SerachIcon">
                    <FaSearch onClick={() => fetchWeather(location)} style={{ color: "white", fontSize: '20px' }} />
                  </div>
                  <div className="CurrentLocation">
                    <MdMyLocation onClick={currentLocation} style={{ color: "white", fontSize: '20px' }} />
                  </div>
                </div>
              </div>
              {data && (
                <>
                  <p id='CityWeather'>{data.name}</p>
                  <div className='Temprature'>
                    <p>Temperature</p> <span>{data.main.temp}°c</span>
                  </div>
                  <div className='Temprature'>
                    <p>Humidity</p> <span>{data.main.humidity}%</span>
                  </div>
                  <div className='Temprature'>
                    <p>Visibility</p> <span>{data.visibility / 1000} km</span>
                  </div>
                  <div className='Temprature'>
                    <p>Wind Speed</p> <span>{data.wind.speed} km/h</span>
                  </div>
                </>
              )}
              {loading && <img style={{width:'30%',height:'100%',margin:'20% 32%'}} src={LoadingAnimation} alt="Loading Animation" />}
              {error && <img src={ErrorAnimation} style={{width:'30%',height:'100%',margin:'20% 32%'}} alt="Error Animation" />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
