const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://johnfso:${password}@cluster0.dgavp.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url);

const contactSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
});

const Contact = mongoose.model("Contact", contactSchema);

if (process.argv.length === 5) {
  const contact = new Contact({
    name: process.argv[3],
    number: String(process.argv[4]),
  });

  contact
    .save()
    .then((results) => {
      console.log(`${process.argv[3]} added to phonebook!`);
      mongoose.connection.close();
    })
    .catch((error) => {
      console.log(error);
      mongoose.connection.close();
    });
} else {
  Contact.find({}).then((results) => {
    results.forEach((contact) => {
      console.log(contact);
    });
    mongoose.connection.close();
  });
}
