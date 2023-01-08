const Persons = ({ persons }) => {
  return (
    <div>
      {persons.map((person) => {
        return (
          <p key={person.id}>
            {person.name} {person.number}
          </p>
        );
      })}
    </div>
  );
};

export default Persons;
