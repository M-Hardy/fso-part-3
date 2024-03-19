import Person from "./Person.jsx";

const PersonList = ({ peopleToShow, deletePerson }) => {
    return (
        <div>
            {peopleToShow.map((person) => (
                <Person
                    key={person.id}
                    id={person.id}
                    name={person.name}
                    number={person.number}
                    deletePerson={deletePerson}
                />
            ))}
        </div>
    );
};

export default PersonList;
