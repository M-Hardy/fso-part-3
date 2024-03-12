import Person from "./Person.jsx";

const PersonList = ({ peopleToShow }) => {
  return (
    <div>
      {peopleToShow.map((person) => (
        <Person key={person.id} name={person.name} number={person.number} />
      ))}
    </div>
  );
};

export default PersonList;
