const Weather = ({ city, weather }) => {
    console.log('weather', weather)

    if (weather)
    {
        return (
            <div>
                <h2>Weather in {city}</h2>
                <div>temperature {weather.main.temp - 273.15} &deg;C</div>
                <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}></img>
                <div>wind {weather.wind.speed} m/s</div>
            </div>
        )
    }
}

export default Weather