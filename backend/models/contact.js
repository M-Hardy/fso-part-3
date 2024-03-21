const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

mongoose
    .connect(url)
    .then((result) => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB:", error.message);
    });

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: [
            3,
            `'{VALUE}' is shorter than the minimum allowed length (3).`,
        ],
    },
    number: {
        type: String,
        required: true,
        minLength: [
            8,
            `Phone number is shorter than minimum allowed length (8).`,
        ],
        validate: {
            validator: function (v) {
                const phoneNumRegex = /^(\d{2,3}-\d{7,})$/;
                return phoneNumRegex.test(v);
            },
            message:
                "Invalid phone number format. Phone number format: <2-3 digits>-<7+ digits>",
        },
    },
});

contactSchema.set("toJSON", {
    transform: (contact, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model("Contact", contactSchema);
