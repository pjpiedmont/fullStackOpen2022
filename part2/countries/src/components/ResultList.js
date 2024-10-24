const ResultList = ({ countries, handleShow }) => {
  if (countries.length > 1 && countries.length < 10)
  {
    console.log(countries)
    return (
      <div>
        {countries.map((c, i) => <div key={i}>{c.name.official} <button onClick={() => handleShow(c)}>show</button></div>)}
      </div>
    )
  }
}

export default ResultList