const Persons = ({ persons, deleteHandler }) => {
  return (
    <div>
      {persons.map((person) => {
        return (
          <div key={person.id}>
            {person.name} {person.number} <button onClick={() => deleteHandler(person)}>delete</button>
          </div>
        );
      })}
    </div>
  );
};

export default Persons;
