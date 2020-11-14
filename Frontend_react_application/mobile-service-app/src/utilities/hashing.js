import bcrypt from 'bcryptjs'

export default{
    async hashPassword(password, strength){
        try{
            return await bcrypt.hash(password, strength)
        }
        catch(err){
            console.error(err);
        }
    }
}