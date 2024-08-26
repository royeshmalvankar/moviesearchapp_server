import mongoose from "mongoose";

const favmovieSchema = new mongoose.Schema({
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
    mov_id: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    actors: {
        type: [String]
    },
    
});

const FavMovieModel = mongoose.model("FavMovie", favmovieSchema);

export default FavMovieModel