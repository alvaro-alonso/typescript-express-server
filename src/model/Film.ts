import mongoose, { Schema } from "mongoose";


export type FilmDocument = mongoose.Document & {
    name: string;
    released: Date;
    genre: string[];
    userId: Schema.Types.ObjectId
};

const filmSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    released: { type: Date, required: true},
    genre: [{ type: String }],
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }

}, { timestamps: true });;



export const Film = mongoose.model<FilmDocument>("Film", filmSchema);