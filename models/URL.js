import mongoose from 'mongoose';

const URLSchema  = new mongoose.Schema({
    longURL: {
        type: String,
        required: true
    },
    shortURL: {
        type: String,
        required: true,
        unique: true,  
    },
    clicksHistory:[
        {
            label: { type: String, required: true},
            clicks: { type: Number, required: true, default: 0}
        }
    ]
});

export const URL = mongoose.model("URL", URLSchema);