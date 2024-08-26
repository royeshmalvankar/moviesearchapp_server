import mongoose from "mongoose";

const blacklistschema = new mongoose.Schema({
    token: {type:String, required:true, unique:true},
})

const BlacklistModel = mongoose.model("blacklist", blacklistschema)

export default BlacklistModel