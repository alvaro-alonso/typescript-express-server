import mongoose, { Schema } from "mongoose";


export type FilmDocument = mongoose.Document & {
    name: string;
    released: Date;
    genre: string[];
};

const filmSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    released: { type: Date, required: true},
    genre: [{ type: String }],

}, { timestamps: true });



export const Film = mongoose.model<FilmDocument>("Film", filmSchema);