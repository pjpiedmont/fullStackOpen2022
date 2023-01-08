import { useState, useEffect } from "react"
import axios from 'axios'

import Filter from './components/Filter'
import Error from './components/Error'
import ResultList from './components/ResultList'
import Country from './components/Country'

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState('');

  const countriesToShow = filter === ''
    ? countries
    : countries.filter(country =>
      country.name.official.toLowerCase().includes(filter.toLowerCase())
    )

  const handleFilterChange = (event) => setFilter(event.target.value)

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => setCountries(response.data))
  }, [])

  return (
    <div>
      <Filter
        text={filter}
        handleChange={handleFilterChange}
      />
      <Error show={countriesToShow.length > 10} />
      <ResultList
        names={countriesToShow.map(country => country.name.official)}
        show={countriesToShow.length > 1 && countriesToShow.length < 10}
      />
      <Country
        countries={countriesToShow}
        show={countriesToShow.length === 1}
      />
    </div>
  )
}

export default App;
