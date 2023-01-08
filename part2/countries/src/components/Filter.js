const Filter = ({ text, handleChange }) => (
  <div>
    find countries <input value={text} onChange={handleChange} />
  </div>
);

export default Filter;