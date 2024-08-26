import jwt from "jsonwebtoken";
import BlacklistModel from "../model/blacklist.js";
import UserModel from "../model/user.model.js";

export const verifyToken = async(req, res, next) => {
    const authHeader = req.headers.authorization?.split(" ")[1]
    const blacklist_Token = await BlacklistModel.findOne({ token: authHeader })
    if (blacklist_Token) {
        return res.status(403).json({ message: "Invalid Token" });
    }

    if (authHeader) {
        jwt.verify(authHeader, process.env.Key,async (err, user) => {
            if (err) return res.status(403).json({ message: "something went wrong" });
            const userdetails = await UserModel.findOne({ _id: user.id });
            req.user = userdetails;
            next();
        });
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
}