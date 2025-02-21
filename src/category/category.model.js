import { Schema, model } from "mongoose";

const categorySchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: false
    }
},{
    timestamps: true,
    versionKey: false
});

export default model('Category', categorySchema);