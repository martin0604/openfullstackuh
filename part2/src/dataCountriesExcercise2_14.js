import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Filter = (props) => {
  const {filter, filterHandler} = props;
  return(
  <div>
     Find countries<input value={filter} onChange={filterHandler}/>
  </div>
  )
}

const Country = ({name, countrydata, showHandler}) => {
    return(
      <div>
        <label>{name}</label><button onClick={() => showHandler(countrydata)}>Show</button><br/>
      </div>
    )
}

const CountryData = ({name, capital, population, languages, flag, capitalData}) => {
  return (
    <div>
      <h2>{name}</h2>
      <div>Capital: {capital}</div>
      <div>Population: {population}</div>
      <h3>Languages</h3>
      <ul>
      {
        languages.map(language => 
          <li>{language.name}</li>
        )
      }
      <img src={flag} alt="Country flag" width="200" height="100"></img>
      </ul>
    </div>
  )
}

const CountryWeather = ({capitalData}) => {
  return (
        <div>
          <h3>Weather in {capitalData.location.name}</h3>
          <div><b>Temperature: </b> {capitalData.current.temperature} Celsius</div>
          <img src={capitalData.current.weather_icons[0]} alt="Weather icon" width="200" height="100"></img>
          <div><b>Wind: </b> {capitalData.current.wind_speed} mph direction {capitalData.current.wind_dir}</div>
        </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]); 
  const [filter, setFilter] = useState('');
  const [weatherData, setWeatherData] = useState({}); //Weather data for one country
  const [cargaTiempo, setCargatiempo] = useState(false);
  const api_key = process.env.REACT_APP_API_KEY; //api key for getting weather data for a country

  useEffect(() =>{
    axios.get(`https://restcountries.eu/rest/v2/all`).then(response => {
      console.log("Promise fulfilled");
      setCountries(response.data);
    });
  }, []);

  useEffect(() =>{
        if(filteredCountries.length === 1){
        let params = {
          access_key: api_key,
          query: filteredCountries[0].capital
        }
        axios.get(`http://api.weatherstack.com/current`, {params}).then(response => {
          console.log("Weather promise fulfilled");
          setWeatherData(response.data);
          setCargatiempo(true);
        });
        } else{
          setCargatiempo(false);
        }
  }, [filteredCountries]);

  const handleFilterField = (event) => {
    console.log(event.target.value);
    setFilter(event.target.value);
    setFilteredCountries(countries.filter(country => country.name.includes(event.target.value)));
    //console.log(persons.filter(person => person.name.includes(event.target.value)));
  }

  const handleShowButton = (country) => {
    setFilteredCountries([country]);
  }

  if(filteredCountries.length > 10){
    return (
      <div>
        <Filter filter={filter} filterHandler={handleFilterField}/>
        <div>Too many matches, specify another filter.</div>
      </div>
    )
  }

  if(filteredCountries.length === 1){
    
    return (
      <div>
        <Filter filter={filter} filterHandler={handleFilterField}/>   
           
        { filteredCountries.map(country => 
          <CountryData key={country.alpha3Code} name={country.name} capital={country.capital} population={country.population} 
          languages={country.languages} flag={country.flag} capitalData={weatherData}/>
        )
        }

        { (cargaTiempo == true)? <CountryWeather capitalData={weatherData}/> : ''}
      </div>
    )
  }

  return (
    <div>
      <Filter filter={filter} filterHandler={handleFilterField}/>   
         
      { filteredCountries.map(country => 
        <Country key={country.alpha3Code} name={country.name} countrydata={country} showHandler={handleShowButton}/>
      )
      }
      ...
    </div>
  )
}

export default App
