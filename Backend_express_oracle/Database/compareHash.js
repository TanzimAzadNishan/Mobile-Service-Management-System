const bcrypt = require('bcryptjs');

module.exports = async function(password, hashedPassword){
    try{
        return await bcrypt.compare(password, hashedPassword)
    }
    catch(err){
        console.error(err);
    }
}