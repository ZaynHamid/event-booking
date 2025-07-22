const express = require('express');
const { createEvent, getEvents, getEventById, updateEvent, deleteEvent } = require('./eventHandler');
const { createUser, loginUser, bookEvent, fetchUserEvents } = require('./usersHandler');
const { generateCheckoutSession } = require('./stripe');
const { authMiddleware, adminMiddleware } = require('./authHandler');
const app = express();
const PORT = 3000;

app.use(express.json());

//admin routes
app.post('/createEvent', authMiddleware, adminMiddleware, async (req, res) => {
    const { title, date, location, description, duration, capacity, price } = req.body;

    if (!title || !date || !location || !description || !duration || !capacity || !price) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        await createEvent(title, date, location, description, duration, capacity, price)
            .then(event => res.status(201).json({ message: "Event created successfully", event }))

    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ message: "Error creating event", error: error.message });
    }

});

app.get('/getEvents', async (req, res) => {
    try {
        const events = await getEvents();
        res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ message: "Error fetching events", error: error.message });
    }
});


app.get('/getEvent/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const event = await getEventById(id);
        res.status(200).json(event);
    } catch (error) {
        console.error("Error fetching event by ID:", error);
        res.status(500).json({ message: "Error fetching event", error: error.message });
    }
});

//admin route to update an event
app.put('/updateEvent/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
        const updatedEvent = await updateEvent(id, updateData);
        res.status(200).json({ message: "Event updated successfully", event: updatedEvent });
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ message: "Error updating event", error: error.message });
    }
});

//admin route to delete an event
app.delete('/deleteEvent/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const deletedEvent = await deleteEvent(id);
        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json({ message: "Event deleted successfully", event: deletedEvent });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ message: "Error deleting event", error: error.message });
    }
});

//admin route to create a user
app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await createUser(name, email, password);
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    try {
        const { user, token } = await loginUser(email, password);
        res.status(200).json({ message: "User logged in successfully", user, token });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Error logging in user", error: error.message });
    }
});

app.post("/bookEvent", authMiddleware, async (req, res) => {
    const { email, eventId } = req.body;
    if (!email || !eventId) {
        return res.status(400).json({ message: "Email and event ID are required" });
    }
    try {
        const updatedUser = await bookEvent(email, eventId);
        res.status(200).json({ message: "Event booked successfully", user: updatedUser });
    } catch (error) {
        console.error("Error booking event:", error);
        res.status(500).json({ message: "Error booking event", error: error.message });
    }
});

app.post("/getUserEvents", authMiddleware, async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    try {
        const userEvents = await fetchUserEvents(email);
        res.status(200).json(userEvents);
    } catch (error) {
        console.error("Error fetching user events:", error);
        res.status(500).json({ message: "Error fetching user events", error: error.message });
    }
}
);

app.post("/create-checkout-session", authMiddleware, async (req, res) => {
    const { eventId, userEmail } = req.body;

    if (!eventId || !userEmail) {
        return res.status(400).json({ message: "Event ID and user email are required" });
    }

    try {
        const session = await createCheckoutSession(eventId, userEmail);
        res.status(200).json({ sessionId: session.id });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ message: "Error creating checkout session", error: error.message });
    }
});

app.post("/checkout-session", authMiddleware, async (req, res) => {
    const { eventId, email } = req.body;
    if (!eventId || !email) {
        return res.status(400).json({ message: "Event ID and email are required" });
    }

    try {
        const session = await generateCheckoutSession(eventId, email);
        res.status(200).json({ sessionUrl: session.url });
    } catch (error) {
        console.error("Error generating checkout session:", error);
        res.status(500).json({ message: "Error generating checkout session", error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});