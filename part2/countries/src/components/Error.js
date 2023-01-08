const Error = ({ show }) => {
  if (show) {
    return <div>Too many matches, specify another filter</div>
  }
}

export default Error