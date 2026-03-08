import mongoose from 'mongoose';

function connectToDB() {
    mongoose.connect(process.env.MONGODB_URI).then(()=>{
        // Connected to MongoDB
    }).catch(err => {
        // MongoDB connection error
    })
};


export default connectToDB;