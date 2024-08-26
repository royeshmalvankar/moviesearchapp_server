import express from "express"
import { authRole } from "../middleware/auth.roles.js"
import FavMovieModel from "../model/favorites.model.js"


const favoriteRoutes = express.Router()

favoriteRoutes.post("/addfav",authRole("ADMIN"), async(req, res) => {
    try {
        let MovieAuth = await FavMovieModel.find({imdbID:req.body.imdbID}) 
        if(MovieAuth.length!==0){
         res.send({"message":"Movie already exists"})
         return
        }
        const {title,year,imdbID,type,rating,genre,poster,actors,mov_id} = req.body
        let movie =  new FavMovieModel(
            {
                title,
                year,
                imdbID,
                type,
                rating,
                genre,
                poster,
                mov_id,
                userId:req.user._id,
                actors
            }
        )
        await movie.save()
        res.status(201)
        res.json({"message":"movie added successfully","data":movie,"userId":req.user._Id})
    } catch (error) {
        res.send(`The data is not valid "${error}" or some error occured`) 
    }
    })

    
favoriteRoutes.get("/favall",authRole("USER","ADMIN"),async(req,res)=>{
    try {
        let data = await FavMovieModel.find({userId:req.user._id})
        res.status(200)
        res.json({"message":"success data fetched successfully","data":data})
    } catch (error) {
        res.status(400)
        console.log("Failed to fetch data",error)
    }
})

favoriteRoutes.delete("/delete/:id",authRole("ADMIN"),async(req,res)=>{
    try {
        await FavMovieModel.findByIdAndDelete(req.params.id)
        res.status(200)
        res.json({"message":"movie deleted successfully"})
    } catch (error) {
        res.status(400)
        console.log("Failed to fetch data",error)
    }
})

export default favoriteRoutes