const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const { JWT_SECRET, JWT_EXPIRY } = require('../../config/server-config');



function checkPassword(plainPassword,encryptedPassword){
    try {
        return bcrypt.compareSync(plainPassword,encryptedPassword);
    } catch (error) {
        throw error;
    }
}

function createToken(input){
    try {
        return jwt.sign(input,JWT_SECRET,{expiresIn:JWT_EXPIRY});
    } catch (error) {
        throw error;
    }
}


module.exports={
    checkPassword,
    createToken
}