import { useState, useEffect } from "react"
import axios from 'axios'

import Filter from './components/Filter'
import Error from './components/Error'
import ResultList from './components/ResultList'
import Country from './components/Country'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [displayCountry, setDisplayCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  const filteredCountries = filter === ''
    ? countries
    : countries.filter(country =>
      country.name.official.toLowerCase().includes(filter.toLowerCase())
    )

  const handleFilterChange = (event) => setFilter(event.target.value)

  const handleCountryChange = (country) => {
    setDisplayCountry(country)
    getWeather(country)
  }

  const getWeather = (country) => {
    const apiKey = process.env.REACT_APP_WEATHER_API_KEY
    console.log('api key:', apiKey)
  
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]},${country.cca2}&APPID=${apiKey}`

    axios
      .get(url)
      .then(res => {
        console.log(res.data)
        setWeather(res.data)
      })
  }

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => setCountries(response.data))
  }, [])

  useEffect(() => {
    if (filteredCountries.length === 1)
    {
      setDisplayCountry(filteredCountries[0])
      getWeather(filteredCountries[0])
    }

    if (filteredCountries.length > 10)
    {
      setDisplayCountry(null)
      setWeather(null)
    }
  }, [filteredCountries])

  return (
    <div>
      <Filter
        text={filter}
        handleChange={handleFilterChange}
      />
      <Error show={filteredCountries.length > 10} />
      <ResultList
        countries={filteredCountries}
        handleShow={handleCountryChange}
      />
      <Country
        country={displayCountry}
        weather={weather}
      />
    </div>
  )
}

export default App;
