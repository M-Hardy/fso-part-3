import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm.jsx";
import PersonList from "./components/PersonList.jsx";
import phoneService from "./services/phonebook.js";

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState("");
    const [newNumber, setNewNumber] = useState("");
    const [newSearch, setNewSearch] = useState("");
    const [showAll, setShowAll] = useState(true);

    useEffect(() => {
        phoneService.getAll().then((responseData) => {
            setPersons(responseData);
        });
    }, []);

    const handleNameChange = (event) => setNewName(event.target.value);
    const handleNumberChange = (event) => setNewNumber(event.target.value);
    const handleSearchChange = (event) => {
        setNewSearch(event.target.value);
        setShowAll(newSearch === "" ? true : false);
    };

    const peopleToShow = showAll
        ? persons
        : persons.filter((person) =>
              person.name.toLowerCase().includes(newSearch)
          );

    const addPerson = (event) => {
        event.preventDefault();
        const person = {
            name: newName,
            number: newNumber,
        };
        const samePerson = persons.find(
            (person) => person.name.toLowerCase() === newName.toLowerCase()
        );
        if (samePerson && newNumber == samePerson.number) {
            alert(`${newName} is already added to the phonebook.`);
        } else if (samePerson && newNumber !== samePerson.number) {
            updateNumber(samePerson, newNumber);
        } else {
            phoneService
                .create(person)
                .then((returnedData) =>
                    setPersons(persons.concat(returnedData))
                );
        }
        setNewName("");
        setNewNumber("");
    };

    // can immediately update component state and re-render without
    // having to wait for back-end to update; HOWEVER - if request fails
    // but we still update component state immediately, then front and
    // backend states wil be unsynchronized (at least until next get all
    // call)
    // THEREFORE - best practice is to promise chain, update
    // frontend only when we know backend has certainly been updated
    const deletePerson = (id) => {
        const person = persons.find((person) => person.id === id);
        const confirmDelete = window.confirm(`Delete ${person.name} ?`);
        if (confirmDelete) {
            phoneService.remove(person.id).then((deletedPerson) => {
                const newPersons = persons.filter(
                    (person) => person.id !== deletedPerson.id
                );
                setPersons(newPersons);
            });
        }
    };

    const updateNumber = (personToUpdate, newNumber) => {
        const confirmUpdate = window.confirm(
            `${personToUpdate.name} is already added to phonebook, replace the old number with a new one?`
        );
        if (confirmUpdate) {
            const updatedPerson = { ...personToUpdate, number: newNumber };
            phoneService
                .update(personToUpdate.id, updatedPerson)
                .then((responseData) => {
                    const newPersons = persons.map((person) =>
                        person.id === responseData.id ? responseData : person
                    );
                    setPersons(newPersons);
                });
        }
    };

    return (
        <div>
            <h2>Phonebook</h2>
            <Filter newSearch={newSearch} onSearchChange={handleSearchChange} />
            <h3>add a new</h3>
            <PersonForm
                handleSubmit={addPerson}
                newName={newName}
                handleNameChange={handleNameChange}
                newNumber={newNumber}
                handleNumberChange={handleNumberChange}
            />
            <h3>Numbers</h3>
            <PersonList
                peopleToShow={peopleToShow}
                deletePerson={deletePerson}
            />
        </div>
    );
};

export default App;
