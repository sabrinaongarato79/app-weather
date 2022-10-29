import { useEffect, useState } from 'react'
import './App.css'

import Button from './components/Button';

const API_KEY = `f01e5b47c1eed6f2b72ff334df7b99bd`;

const App = () => {

  const [city, setCity] = useState('-')
  const [temperature, setTemperature] = useState('-')
  const [windspeed, setWindspeed] = useState('-')
  const [clouds, setClouds ] = useState('-')
  const [pressure, setPressure ] = useState('-')

  const [degree, setDegree] = useState('C')
  const [icon, setIcon] = useState('01d')

  const getDataLocation = () => {

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    
    function success(pos) {
      const crd = pos.coords;
      console.log(`Latitude : ${crd.latitude}`);
      console.log(`Longitude: ${crd.longitude}`);
      getDataWeather(crd.latitude, crd.longitude);
    }
    
    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    
    navigator.geolocation.getCurrentPosition(success, error, options);
  }

  const getDataWeather = (lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((data) => {

        setTemperature(data.main.temp)
        setWindspeed(data.wind.speed)
        setClouds(data.clouds.all)
        setPressure(data.main.pressure)
        setCity(data.name + ", " + data.sys.country)

        setIcon(data.weather[0].icon)

      });
  }

  useEffect(() => {
    getDataLocation();
  });

  const filterData = () => {
    let _newTemp = 0;

    if(degree == 'C') {
      _newTemp = temperature - 273.15;
    } else {
      _newTemp = (temperature - 273.15) * 9/5 + 32;
    }

    return {
      temperature: _newTemp.toFixed(2),
      windspeed: windspeed,
      clouds: clouds,
      pressure: pressure
    }
  }

  const clickButton = () => {
    let _newDegree;
    if(degree == 'C') {
      _newDegree = 'F'
    } else {
      _newDegree = 'C'
    }
    setDegree(_newDegree);
  }

  return <div className='container'>
      <div className="card">
          <div className="title">Weather App</div>
          <div className="sub-title">{city}</div>

          <div className='content-info'>
            <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} className='img-weather' />  
            <div className='info'>
                <div>Temperature ({degree}): <span>{filterData().temperature}</span>°</div>
                <div>Wind-speed <span>{filterData().windspeed}</span>m/s</div>
                <div>Clouds <span>{filterData().clouds}</span>%</div>
                <div>Pressure <span>{filterData().pressure}</span>mb</div>
            </div>
          </div>

          {
           /*
            <Weather 
              icon={icon}
              temperature={filterData().temperature}
              windspeed={filterData().windspeed}
              ...
            />
           */ 
          }

         <Button clickButton={clickButton} />
          
      </div>
  </div>
}

export default App
