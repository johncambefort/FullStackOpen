import { useEffect, useState } from "react";
import contactService from "./services/contacts";
import Person from "./components/Person";
import Input from "./components/Input";
import Button from "./components/Button";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [addedMessage, setAddedMessage] = useState(null);

  useEffect(() => {
    contactService.getAll().then((initialContacts) => {
      setPersons(initialContacts);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    const personObj = {
      name: newName,
      number: newNumber,
    }; // Construct a new Person object

    let person = persons.find((p) => p.name === personObj.name);
    if (person) {
      // already exits
      if (person.number !== personObj.number) {
        if (
          window.confirm(
            `${person.name} is already in the phonebook; update number?`
          )
        ) {
          personObj.id = person.id;
          contactService
            .update(person.id, personObj)
            .then((response) => {
              setPersons(
                // Success: update Persons
                persons.map((p) => (p.id !== personObj.id ? p : personObj))
              );
              setAddedMessage(`Updated ${personObj.name} !`);
              setTimeout(() => setAddedMessage(null), 5000);
            })
            .catch((error) => {
              if (error.response.status === 404) {
                // Person not in database: delete from local Persons array
                setPersons(persons.filter((p) => p.id !== personObj.id));
              }
              setAddedMessage(error.response.data.error);
              setTimeout(() => setAddedMessage(null), 5000);
            });
        }
      }
    } else {
      contactService
        .create(personObj)
        .then((response) => {
          personObj.id = response.id;
          setPersons(persons.concat(personObj));
          setAddedMessage(`Added ${personObj.name}`);
          setTimeout(() => {
            setAddedMessage(null);
          }, 5000);
        })
        .catch((error) => {
          console.log(error.response.data.error);
          setAddedMessage(error.response.data.error);
          setTimeout(() => {
            setAddedMessage(null);
          }, 5000);
        });
    }
  };

  const handleNewName = (event) => {
    setNewName(event.target.value);
  };

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value);
  };

  const handleNewFilter = (event) => {
    setNewFilter(event.target.value);
  };

  const personsToShow =
    newFilter === ""
      ? persons
      : persons.filter((p) =>
          p.name.toLowerCase().includes(newFilter.toLowerCase())
        );

  const handleDelete = (person) => {
    if (window.confirm(`Are you sure you want to delete ${person.name}?`)) {
      contactService
        .remove(person.id, person)
        .then((response) => {
          console.log("deleted!");
          setPersons(persons.filter((p) => p.id !== person.id)); // local delete
        })
        .catch((error) => {
          // alert(`The contact was previously deleted from the server!`)
          setAddedMessage(error.response.data.error);
          setTimeout(() => setAddedMessage(null), 5000);
          setPersons(persons.filter((p) => p.id !== person.id)); // local delete
        });
    }
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification text={addedMessage} />
      <Input
        text={"filter shown with"}
        value={newFilter}
        onChange={handleNewFilter}
      />
      <h3>Add new contact</h3>
      <form onSubmit={addPerson}>
        <Input text={"name"} value={newName} onChange={handleNewName} />
        <Input text={"number"} value={newNumber} onChange={handleNewNumber} />
        <Button text={"add"} />
      </form>
      <h3>Numbers</h3>
      <ul>
        {personsToShow.map((person) => (
          <Person
            key={person.id}
            person={person}
            onDelete={() => handleDelete(person)}
          />
        ))}
      </ul>
    </div>
  );
};

export default App;
