import { useState } from "react";
import Person from "./components/Person";

const App = () => {
  const [persons, setPersons] = useState([{ 
    name: "Arto Hellas",
    phone: "(802) 771-5447"
  }]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("")

  const addPerson = (event) => {
    event.preventDefault();
    const personObj = { 
      name: newName,
      phone: newPhone
     }; // Construct a new Person object

    if (persons.find((p) => p.name === personObj.name)) {
      alert(`${personObj.name} already in the phonebook`);
    } else {
      setPersons(persons.concat(personObj)); // Concat to persons, set state
    }
  };

  const handleNewName = (event) => {
    setNewName(event.target.value);
  };

  const handleNewPhone = (event) => {
    setNewPhone(event.target.value);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNewName} />
        </div>
        <div>
          number: <input value={newPhone} onChange={handleNewPhone} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {persons.map((person) => (
          <Person key={person.name} person={person} />
        ))}
      </ul>
    </div>
  );
};

export default App;
