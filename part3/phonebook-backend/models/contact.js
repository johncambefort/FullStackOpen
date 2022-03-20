const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connecting to phonebook database");
  })
  .catch((error) => {
    console.log("error connecting to phonebook database:", error.message);
  });

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: function (value) {
        return /^\d{2,3}-\d*/.test(value);
      },
      message:
        "Number must have two parts: 2 or 3 digits, followed by a dash, followed by as many digits as necessary!",
    },
    minLength: [8, "Number must have 8 digits or more!"],
    required: [true, "User phone number is required!"],
  },
});

contactSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Contact", contactSchema);
