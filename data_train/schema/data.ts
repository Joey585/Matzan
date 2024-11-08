import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
    id: String,
    text: String,
    userID: String,
});

export const DataModel = mongoose.model('Data', dataSchema);