const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    const salt = 10;
    try {
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (err) {
        console.error("Error hashing password:", err);
        throw err;
    }
}

const comparePassword = async (password, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (err) {
        console.error("Error comparing password:", err);
        throw err;
    }
}

module.exports = { hashPassword, comparePassword };