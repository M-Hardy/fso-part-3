const express = require("express");
const morgan = require("morgan");

const app = express();
app.use(express.json());
app.use(express.static("dist"));
app.use(morgan("tiny"));

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

// "/" requests the root/homepage of a web app. For a web server, "/" refers
// to the root directory or default landing page of the server
app.get("/", (request, response) => {
    response.send("<h1>This is the application's root directory</h1>");
});

app.get("/info", (request, response) => {
    const numPersons = persons.length;
    const requestTime = new Date().toString();
    response.send(
        `<p>Phonebook has info for ${numPersons} people</p><p>${requestTime}</p>`
    );
});

app.get("/api/persons", (request, response) => {
    response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find((person) => person.id === id);
    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter((person) => person.id !== id);
    response.status(204).end();
});

const generateId = (max = 10000) => {
    const id = Math.floor(Math.random() * max);
    return id;
};

app.post("/api/persons", (request, response) => {
    console.log(request);
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

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});
