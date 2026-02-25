import userModel from '../models/user.model.js';


const createUser = async({
    name, email, password, phoneNo,
})=>{
    if(!name || !email || !password || !phoneNo){
        throw new Error('Please enter all fields');
    }
    const user = userModel.create({
        name,
        email,
        password,
        phoneNo
    })
    return user;
}
export default {
    createUser
}
