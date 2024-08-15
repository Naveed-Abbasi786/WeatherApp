import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Weather() {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [Error,setError]=useState(false)

  const fetchWeather = () => {
    setLoading(true);
    setError(false)
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=221a3684f275c49eba9697b039e6d43c`,
      headers: {}
    };

    axios.request(config)
      .then((response) => {
        console.log(response.data);
        setData(response.data);
       setLoading(false)
      })
      .catch((error) => {
        console.log(error);
        setData('')
        setLoading(false)
        setError(true)
      });
  };

  useEffect(() => {
    if(location){
      fetchWeather(location);
    }
  }, []);

  const searchLocation = (e) => {
    if (e.key === "Enter") {
      fetchWeather(location);
    }
  };

  const currentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLoading(true)

          let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=221a3684f275c49eba9697b039e6d43c`,
            headers: {}
          };

          axios.request(config)
            .then((response) => {
              console.log(response.data);
              setData(response.data);
              setLoading(false)
              setError(false)
            })
            .catch((error) => {
              console.log(error);
              setLoading(false)
              setError(true)
            });
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

   const WeatherIcons = (Icons) => {
    switch (Icons) {
      case '01d':
        return <img src="path_to_clear_sky_icon" alt="Clear Sky" />;
      case '02d':
        return <img src="path_to_few_clouds_icon" alt="Few Clouds" />;
      case '03d':
        return <img src="path_to_scattered_clouds_icon" alt="Scattered Clouds" />;
      case '04d':
        return <img src="path_to_broken_clouds_icon" alt="Broken Clouds" />;
      case '09d':
        return <img src="path_to_shower_rain_icon" alt="Shower Rain" />;
      case '10d':
        return <img src="path_to_rain_icon" alt="Rain" />;
      case '11d':
        return <img src="path_to_thunderstorm_icon" alt="Thunderstorm" />;
      case '13d':
        return <img src="path_to_snow_icon" alt="Snow" />;
      case '50d':
        return <img src="path_to_mist_icon" alt="Mist" />;
      default:
        return null;
    }
  };
  return (
    <div>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder='Search'
        onKeyPress={searchLocation}
      />
      <button onClick={currentLocation}>location</button>

      {loading && <h2>Loading...</h2>}
      {Error&& <h2>Correct location Enter</h2>}
      {data && data.main && (
        <div>
          <h2>Location: {data.name} <span> ({data.weather[0].description})</span></h2>
          <h2>Temperature: {data.main.temp}°c</h2>
          <h2>humidity: {data.main.humidity}%</h2>
          <h2>Wind Speed: {data.wind.speed}km/h</h2>
          <h2>visibility: {data.visibility}ml</h2>
          {WeatherIcons(data.weather[0].icon)}
        </div> 
      )}
    </div>
  );
}
