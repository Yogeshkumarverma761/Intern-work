import mongoose from "mongoose";

const clothesSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
    },
    images: [
        {
            type: String,
        }
    ],
    category:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    rating:{
        type: Number,
        default: 4.5,
        min: 0,
        max: 5,
    },
    reviewsCount:{
        type: Number,
        default: 0,
    },
    tags:{
        type: [String],
        default: [],
    },
    fabrics: {
        type: [String],
        default: [],
    },
    colors: {
        type: [String],
        default: [],
    },
    designs: {
        type: [String],
        default: [],
    },
    isFeatured:{
        type: Boolean,
        default: false,
    },
    inStock:{
        type: Boolean,
        default: true,
    },
}, { timestamps: true })

clothesSchema.index({ title: "text", description: "text" });

const clothesModel = mongoose.model('clothes', clothesSchema)
export default clothesModel;