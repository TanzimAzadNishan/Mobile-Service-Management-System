const bcrypt = require('bcryptjs');

module.exports = async function(password, strength){
    try{
        return await bcrypt.hash(password, strength)
    }
    catch(err){
        console.error(err);
    }
}