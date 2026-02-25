import mongoose from "mongoose";

const measurementSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    // Core measurements
    neck:{
        type: Number,
    },
    chest:{
        type: Number,
    },
    waist:{
        type: Number,
    },
    hips:{
        type: Number,
    },
    sleeve:{
        type: Number,
    },
    inseam:{
        type: Number,
    },
    // Additional measurements for AI try-on
    height:{
        type: Number,
    },
    bust:{
        type: Number,
    },
    shoulder:{
        type: Number,
    },
    armLength:{
        type: Number,
    },
    weight:{
        type: Number,
    },
    // AI metadata
    isAIGenerated:{
        type: Boolean,
        default: false,
    },
    confidence:{
        type: Number, // AI confidence score (0-100)
        min: 0,
        max: 100,
    },
}, {
    timestamps: true // Add createdAt and updatedAt
})

const measurementModel = mongoose.model('measurement', measurementSchema)
export default measurementModel;