import Person from "./Person";

const PersonList = ({ persons, deleteHandler }) => {
  return (
    <div>
      {persons.map((person) => {
        return (
          <Person
            key={person.id}
            id={person.id}
            name={person.name}
            number={person.number}
            deleteHandler={deleteHandler}
          />
        );
      })}
    </div>
  );
};

export default PersonList;
