const Filter = ({ text, handleChange }) => (
  <div>
    filter shown with <input value={text} onChange={handleChange} />
  </div>
);

export default Filter;
