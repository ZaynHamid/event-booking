const {User} = require('./schema');
const {hashPassword, comparePassword} = require('./bcrypt');
const jwt = require('jsonwebtoken');


const createUser = async (name, email, password) => {
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: 'user', 
    });
    try {
        const savedUser = await newUser.save();
        console.log("User created successfully:", savedUser);
        return savedUser;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }   
}

const loginUser = async (email, password) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid password");
        }
        console.log("User logged in successfully:", user);
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        return { user, token };
    } catch (error) {
        console.error("Error logging in user:", error);
    throw error;
    }
}

const bookEvent = async (email, eventId) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }
        if (user.events.includes(eventId)) {
            throw new Error("Event already booked");
        }
        user.events.push(eventId);
        const updatedUser = await user.save();
        console.log("Event booked successfully:", updatedUser);
        return updatedUser;
    } catch (error) {
        console.error("Error booking event:", error);
        throw error;
    }
}

const fetchUserEvents = async (email) => {
    try {
        const user = await User.findOne({ email }).populate('events');
        if (!user) {
            throw new Error("User not found");
        }
        console.log("User events fetched successfully:", user.events);
        return user.events;
    } catch (error) {
        console.error("Error fetching user events:", error);
        throw error;
    }
}

module.exports = { createUser, loginUser, bookEvent, fetchUserEvents };