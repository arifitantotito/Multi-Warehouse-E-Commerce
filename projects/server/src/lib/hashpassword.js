const bcrypt = require("bcrypt");
const saltRounds = 10;

// hashpassword function: function untuk melakukan hashing pada password yang diterima
const hashPassword = async (password) =>{
    try {
        return await bcrypt.hash(password, saltRounds);
    } catch (error) {
        return null;
    }
};

//hashMatch function : Function untuk melakukan pengecekan dari apssword yang diinput dengan password yang ada di database
const hashMatch = async (password, hashedPassword) =>{
    try {
        let match = await bcrypt.compare(password, hashedPassword);
        return match;
    } catch (error) {
        return false;
    }
};

module.exports = {
    hashPassword,
    hashMatch
}