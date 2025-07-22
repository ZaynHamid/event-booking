const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI

mongoose.connect(uri)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch(err => console.error("MongoDB connection error:", err));

const eventSchema = new mongoose.Schema({
    title: String,
    description: String,
    location: String,
    duration: Number,
    capacity: Number,
    date: Date,
    price: Number,
});

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: "events" }],
    role: String
});

const Event = mongoose.model("events", eventSchema);
const User = mongoose.model("users", userSchema);

module.exports = { Event, User};