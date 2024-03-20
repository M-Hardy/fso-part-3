require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Contact = require("./models/contact");
const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("dist"));
app.use(morgan("tiny"));

// Overridden with index.html from frontend in dist folder
// using express.static('dist')
app.get("/", (request, response) => {
    response.send("<h1>This is the application's root directory</h1>");
});

app.get("/info", (request, response) => {
    Contact.find({}).then((contacts) => {
        const numContacts = contacts.length;
        const requestTime = new Date().toString();
        response.send(
            `<p>Phonebook has info for ${numContacts} people</p><p>${requestTime}</p>`
        );
    });
});

app.get("/api/contacts", (request, response) => {
    Contact.find({}).then((contacts) => {
        response.json(contacts);
    });
});

app.get("/api/contacts/:id", (request, response) => {
    Contact.findById(request.params.id).then((contact) => {
        response.json(contact);
    });
});

app.delete("/api/contacts/:id", (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter((person) => person.id !== id);
    response.status(204).end();
});

const generateId = (max = 10000) => {
    const id = Math.floor(Math.random() * max);
    return id;
};

app.post("/api/contacts", (request, response) => {
    const body = request.body;
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "content missing",
        });
    }

    if (persons.find((person) => person.name === body.name)) {
        return response.status(400).json({
            error: "name must be unique",
        });
    }

    const newPerson = {
        name: body.name,
        number: body.number,
        id: generateId(),
    };

    persons = persons.concat(newPerson);
    response.json(newPerson);
});

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});
