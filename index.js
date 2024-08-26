import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./dbs/db.js";
import userRoute from "./route/user.route.js";
import movieRoute from "./route/movie.route.js";
import favoriteRoute from "./route/favorite.route.js";
import { verifyToken } from "./middleware/auth.middleware.js";

const app = express();

dotenv.config();
app.use(express.json());
app.use(cors(
    {
        origin:"*"
    }
));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :remote-user [:date[clf]]'));
app.use("/user", userRoute);
app.use("/movie",verifyToken, movieRoute);
app.use("/favorite",verifyToken, favoriteRoute);

const port = process.env.PORT || 3005;

app.get("/", (req, res) => {
    res.send("Hello World!");
});


app.listen(port, async() => {
    await connectDB();
    console.log(`Example app listening on port ${port}`);
})