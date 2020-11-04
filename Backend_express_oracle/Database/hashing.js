const bcrypt = require('bcryptjs');

module.exports = {
    async hashPassword(password, strength){
        try{
            return await bcrypt.hash(password, strength)
        }
        catch(err){
            console.error(err);
        }
    },

    async compareHash(password, hashedPassword){
        try{
            return await bcrypt.compare(password, hashedPassword)
        }
        catch(err){
            console.error(err);
        }
    }
}