import { useEffect, useState } from "react";
import contactService from "./services/contacts"
import Person from "./components/Person";
import Input from "./components/Input";
import Button from "./components/Button";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newFilter, setNewFilter] = useState("");

  useEffect(() => {
    contactService
      .getAll()
      .then(initialContacts => {
        setPersons(initialContacts)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault();
    const personObj = {
      name: newName,
      phone: newPhone,
      id: persons.length + 1,
    }; // Construct a new Person object

    let person = persons.find((p) => p.name === personObj.name);
    if (person) { // already exits
      if(person.phone !== personObj.phone) {
        if(window.confirm(`${person.name} is already in the phonebook; update number?`)) {
          personObj.id = person.id; // use original ID
          contactService
            .update(person.id, personObj)
            .then(response => console.log(response));
          setPersons(persons.map(p => p.id !== personObj.id ? p : personObj));
        }
      }
    } else {
      // save to database
      contactService
        .create(personObj)
        .then(response => {
          console.log(response);
          setPersons(persons.concat(personObj));
        })
    }
  };

  const handleNewName = (event) => {
    setNewName(event.target.value);
  };

  const handleNewPhone = (event) => {    
    setNewPhone(event.target.value);
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

  return (
    <div>
      <h1>Phonebook</h1>
      <Input text={"filter shown with"} value={newFilter} onChange={handleNewFilter} />
      <h3>Add new contact</h3>
      <form onSubmit={addPerson}>
        <Input text={"name"} value={newName} onChange={handleNewName} />
        <Input text={"number"} value={newPhone} onChange={handleNewPhone} />
        <Button />
      </form>
      <h3>Numbers</h3>
      <ul>
        {personsToShow.map((person) => (
          <Person key={person.id} person={person} />
        ))}
      </ul>
    </div>
  );
};

export default App;
