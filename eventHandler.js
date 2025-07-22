const { Event } = require("./schema");

const createEvent = async (title, date, location, description, duration, capacity, price) => {
    const newEvent = new Event({
        title,
        date,
        location,
        description,
        duration,
        capacity,
        price
    });
    try {
        const savedEvent = await newEvent.save();
        console.log("Event created successfully:", savedEvent);
        return savedEvent;
    } catch (error) {
        console.error("Error creating event:", error);
        throw error;
    }
}

const getEvents = async () => {
    try {
        const events = await Event.find();
        return events;
    } catch (error) {
        console.error("Error fetching events:", error);
        throw error;
    }
}

const getEventById = async (id) => {
    try {
        const event = await Event.findById(id);
        if (!event) {
            throw new Error("Event not found");
        }
        return event;
    } catch (error) {
        console.error("Error fetching event by ID:", error);
        throw error;
    }
}

const updateEvent = async (id, updateData) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedEvent) {
            throw new Error("Event not found");
        }
        return updatedEvent;
    } catch (error) {
        console.error("Error updating event:", error);
        throw error;
    }
}

const deleteEvent = async (id) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(id);
        if (!deletedEvent) {
            throw new Error("Event not found");
        }
        return deletedEvent;
    }
    catch (error) {
        console.error("Error deleting event:", error);
        throw error;
    }
}

module.exports = { createEvent, getEvents, getEventById, updateEvent, deleteEvent };