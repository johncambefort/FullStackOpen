const express = require("express");
const app = express();

app.use(express.json());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const infoText = `Phonebook has info for ${persons.length} people.`;
  const dateText = `${new Date()}`;
  const htmlText = `
    <div>
    <p>${infoText}</p>
    <p>${dateText}</p>
    </div>
    `;

  response.send(htmlText);
})

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const contact = persons.find((p) => p.id === id);

  if(!contact) {
    return response.status(404).end();
  }
  response.json(contact);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((p) => p.id !== id);
  
  return response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if(!body.name) {
    return response.status(400).json({
      error: "Missing name"
    });
  } else if(!body.number) {
    return response.status(400).json({
      error: "Missing number"
    })
  }

  const newPerson = {
    id: body.id || Math.floor(Math.random() * 100000),
    name: body.name,
    number: body.number,
    date: new Date()
  }

  if(persons.find((p) => p.name === newPerson.name)) {
    return response.status(403).json({
      error: "Name must be unique"
    });
  }

  persons = persons.concat(newPerson);
  response.json(newPerson);

});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
