import Weather from "./Weather"

const Country = ({ country, weather }) => {
  if (country)
  {
    return (
      <div>
        <h1>{country.name.official}</h1>
        <div>capital {country.capital[0]}</div>
        <div>area {country.area}</div>

        <h3>languages:</h3>
        <ul>
          {Object.values(country.languages).map((lang, i) => <li key={i}>{lang}</li>)}
        </ul>

        <img src={country.flags.png} alt={`Flag of ${country.name.official}`}></img>

        <Weather
          city={country.capital[0]}
          weather={weather}
        />
      </div>
    )
  }
}

export default Country