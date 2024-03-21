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

app.get("/info", (request, response, next) => {
    Contact.find({})
        .then((contacts) => {
            const numContacts = contacts.length;
            const requestTime = new Date().toString();
            response.send(
                `<p>Phonebook has info for ${numContacts} people</p><p>${requestTime}</p>`
            );
        })
        .catch((error) => next(error));
});

app.get("/api/contacts", (request, response, next) => {
    Contact.find({})
        .then((contacts) => {
            response.json(contacts);
        })
        .catch((error) => next(error));
});

app.get("/api/contacts/:id", (request, response, next) => {
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

app.post("/api/contacts", (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({ error: "content missing" });
    }

    const contact = new Contact({
        name: body.name,
        number: body.number,
    });

    contact.save().then((savedContact) => {
        response.json(savedContact);
    });
});

app.put("/api/contacts/:id", (request, response, next) => {
    const body = request.body;

    const contact = {
        name: body.name,
        number: body.number,
    };

    Contact.findByIdAndUpdate(request.params.id, contact, { new: true })
        .then((updatedNote) => {
            response.json(updatedNote);
        })
        .catch((error) => next(error));
});

app.delete("/api/contacts/:id", (request, response, next) => {
    Contact.findByIdAndDelete(request.params.id)
        .then((result) => {
            response.status(204).end();
        })
        .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    // given ID cannot be cast to ObjectId by Mongo - malformatted ID given
    // (does not conform to expected format of an Object Id)
    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" });
    }

    next(error);
};
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});
