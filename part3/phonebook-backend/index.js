require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const Contact = require("./models/contact");
const { countDocuments } = require("./models/contact");

const app = express();

app.use(express.static("build"));
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

app.get("/info", (request, response) => {
  Contact.find({}).then((contacts) => {
    response.send({
      date: new Date(),
      info: `Number of contacts currently in the database: ${contacts.length}`,
    });
  });
});

app.get("/api/persons", (request, response) => {
  Contact.find({}).then((contacts) => {
    response.json(contacts);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Contact.findById(request.params.id)
    .then((contact) => {
      if (contact) {
        response.json(contact);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;
  if (!body.name) {
    return response.status(400).json({
      error: "Missing name",
    });
  } else if (!body.number) {
    return response.status(400).json({
      error: "Missing number",
    });
  }

  const newContact = new Contact({
    name: body.name,
    number: body.number,
  });

  newContact
    .save()
    .then((savedContact) => {
      response.json(savedContact);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response) => {
  const { name, number } = request.body;

  Contact.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedContact) => {
      response.json(updatedContact);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
