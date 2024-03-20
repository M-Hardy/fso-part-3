const mongoose = require("mongoose");

if (process.argv.length < 3 || process.argv.length > 5) {
    console.log("Usage:");
    console.log("(1) Get all entries in phonebook: node mongo.js <password> ");
    console.log(
        "(2) Enter entry into phonebook: node mongo.js <password> <contact-name> <contact-number>"
    );
    process.exit(1);
}

const password = process.argv[2];
const contactName = process.argv.length === 5 ? process.argv[3] : null;
const contactNumber = process.argv.length === 5 ? process.argv[4] : null;

const url = `mongodb+srv://mbhardy001:${password}@cluster0.tlbwd4j.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Contact = mongoose.model("Contact", contactSchema);

if (contactName && contactNumber) {
    const contact = new Contact({
        name: contactName,
        number: contactNumber,
    });

    contact.save().then((result) => {
        console.log(
            `added ${contactName} number ${contactNumber} to phonebook`
        );
        mongoose.connection.close();
    });
} else {
    console.log("phonebook: ");
    Contact.find({}).then((result) => {
        result.forEach((contact) => {
            console.log(`${contact.name} ${contact.number}`);
        });
        mongoose.connection.close();
    });
}
