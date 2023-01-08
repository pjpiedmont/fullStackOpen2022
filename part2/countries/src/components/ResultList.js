const ResultList = ({ names, show }) => {
  if (show) {
    return (
      <div>
        {names.map((name, i) => <div key={i}>{name}</div>)}
      </div>
    )
  }
}

export default ResultList