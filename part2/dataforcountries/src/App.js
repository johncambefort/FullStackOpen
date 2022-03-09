import React, { useState, useEffect } from "react";
import axios from "axios";

const Input = ({ value, onChange }) => {
  return <input value={value} onChange={onChange} />;
};

const CountryOptions = ({ countries }) => {
  return (
    <ul>
      {countries.map((country) => (
        <Country key={country.name.common} country={country} />
      ))}
    </ul>
  );
};

const Country = ({ country }) => {
  return <li>{country.name.common}</li>;
};

const CountryInfo = ({ countries }) => {
  let country = countries[0];
  return (
    <>
      <h1>{country.name.common}</h1>
      <p>capital: {country.capital[0]}</p>
      <p>area: {country.area}</p>
      <h3>Languages:</h3>
      <ul>
        {Object.values(country.languages).map((val) => <li key={val}>{val}</li>)}
      </ul>
      <img src={country.flags.png} alt="Flag"/>
    </>
  );
}

function App() {
  const [newInput, setNewInput] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => {
        setFilteredCountries(response.data);
      })
  }, []);

  const newFilteredCountries = (newInput === "")
  ? []
  : filteredCountries.filter((country) => country.name.common.toLowerCase().includes(newInput.toLowerCase()));

  const handleNewInput = (event) => {
    setNewInput(event.target.value);
  };

  const showCountry = () => {
    if(newFilteredCountries.length === 1) {
      return <CountryInfo countries={newFilteredCountries} />
    } else {
      return <></>
    }
  }

  return (
    <div>
      find countries <Input value={newInput} onChange={handleNewInput} />
      <CountryOptions countries={newFilteredCountries} />
      <div>
        {showCountry()}
      </div>
    </div>
  );
}

export default App;
