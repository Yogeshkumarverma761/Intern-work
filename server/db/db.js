import mongoose from 'mongoose';

function connectToDB() {
    mongoose.connect(process.env.MONGODB_URI).then(()=>{
        console.log('Connected to MongoDB');
    }).catch(err => console.log(err))
};


export default connectToDB;