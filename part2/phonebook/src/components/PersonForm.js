const PersonForm = ({ name, number, handleChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input name="name" value={name} onChange={handleChange} />
        <br />
        number: <input name="number" value={number} onChange={handleChange} />
      </div>

      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
