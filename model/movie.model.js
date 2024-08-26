import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    imdbID: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    genre: {
        type: [String],
        required: true
    },
    poster: {
        type: String,
        required: true
    },
    actors: {
        type: [String],
        required: true
    },
    
});

const MovieModel = mongoose.model("Movie", movieSchema);

export default MovieModel