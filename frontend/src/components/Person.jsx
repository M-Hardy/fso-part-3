const Person = ({ id, name, number, deletePerson }) => {
    return (
        <div>
            {name} {number}{" "}
            <button onClick={() => deletePerson(id)}>delete</button>
        </div>
    );
};

export default Person;
