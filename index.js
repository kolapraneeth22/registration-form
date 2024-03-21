const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

mongoose.connect(`mongodb+srv://kolapraneeth222:KpMongo22@cluster0.2nkclt6.mongodb.net`)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch(error => {
        console.error("MongoDB connection error:", error);
    });

// registration schema
const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

// model of registration schema
const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/pages/index.html");
});

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await Registration.findOne({ email: email });
        // Check for existing user
        if (existingUser) {
            console.log("User already exists");
            // Respond with appropriate status code and message
            return res.status(409).send("User already exists");
        }

        const registrationData = new Registration({
            name,
            email,
            password,
        });
        await registrationData.save();
        res.redirect("/success");
    } catch (error) {
        console.log(error);
        // Respond with appropriate status code and message
        res.status(500).send("Internal Server Error");
    }
});

app.get("/success", (req, res) => {
    res.sendFile(__dirname + "/pages/success.html");
});

app.get("/error", (req, res) => {
    res.sendFile(__dirname + "/pages/error.html");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
