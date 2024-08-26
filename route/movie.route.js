import express from "express"
import  { authRole } from "../middleware/auth.roles.js"
import generateUniqueId from "generate-unique-id"
import MovieModel from "../model/movie.model.js"

const movieRoutes = express.Router()

movieRoutes.post("/addmovie",authRole("ADMIN"), async(req, res) => {
    try {
        let MovieAuth = await MovieModel.find({imdbID:req.body.imdbID}) 
        if(MovieAuth.length!==0){
         res.send({"message":"Movie already exists"})
         return
        }
        const {title,year,type,rating,genre,poster,actors} = req.body
        const id=generateUniqueId({length:10})
        let movie =  new MovieModel(
            {
                title,
                year,
                imdbID:id,
                type,
                rating,
                genre:genre.split(","),
                poster,
                actors:actors.split(","),
            }
        )
        await movie.save()
        res.status(201)
        res.json({"message":"movie added successfully","data":movie})
    } catch (error) {
        res.send(`The data is not valid "${error}" or some error occured`) 
    }
    })

movieRoutes.get("/all",authRole("USER","ADMIN"),async(req,res)=>{
    try {
        let data = await MovieModel.find()
        let count = await MovieModel.find().countDocuments()
        res.status(200)
        res.json({"message":"success data fetched successfully","data":data,"count":count})
    } catch (error) {
        res.status(400)
        console.log("Failed to fetch data",error)
    }
})

movieRoutes.get("/search",authRole("USER","ADMIN"), async (req, res) => {
    let {title,imdbID,type,actors,genre,rating,sortby,year,order="asc",page="1",limit="10"} = req.query
    let query = {}
    if(title){
        query.title = { $regex: title, $options: "i" }
    }
    if(genre){
        query.genre = { $in: [genre] }
    }
    if(actors){
        query.actors = { $in: [actors] }
    }
    if(type){
        query.type = type
    }
    if(imdbID){
        query.imdbID = imdbID
    }
    if(rating){
        query.rating = rating
    }
    if(year){
        query.year = year
    }
    let sortquery = {}
    if(sortby){
        sortquery[sortby] = order==="asc" ? 1 : -1
    }
    page = parseInt(page)
    limit = parseInt(limit)
    let skip = (page-1)*limit
    
    try {
        let data = await MovieModel.find(query).sort(sortquery).skip(skip).limit(limit)
        let count = await MovieModel.find().countDocuments()
        let genrecount = await MovieModel.find(query).countDocuments()
        res.status(200)
        res.json({"message":"success data fetched successfully","data":data,"count":count,"genrecount":genrecount})
    } catch (error) {
        res.status(400)
        console.log("Failed to fetch data",error)
    }
})

movieRoutes.put("updatemovie/:id",authRole("ADMIN"), async (req, res) => {
    const {title,year,type,rating,genre,poster,actors} = req.body
    const {id} = req.params
    try {
        let updatedMovie = await MovieModel.findByIdAndUpdate({ _id:id},
            {
                title,
                year,
                type,
                rating,
                genre:genre.split(","),
                poster,
                actors:actors.split(","),
            }
        )
        res.status(200)
        res.json({"message":"success data updated successfully","data":updatedMovie})
    } catch (error) {
        res.status(400)
        console.log("Failed to update data",error)
    }
})

movieRoutes.patch("/update/:id",authRole("ADMIN"), async (req, res) => {
    const {title,year,type,rating,genre,poster,actors} = req.body
    const {id} = req.params
    try {
        const patchdata = await MovieModel.findByIdAndUpdate({ _id:id},
            {
                title,
                year,
                type,
                rating,
                genre:genre.split(","),
                poster,
                actors:actors.split(","),
            }
        )
        res.status(200)
        res.json({"message":"success data updated successfully","data":patchdata})
    } catch (error) {
        res.status(400)
        console.log("Failed to update data",error)
    }
    })

movieRoutes.delete("/delete/:id",authRole("ADMIN"), async (req, res) => {
    const {id} = req.params
    try {
        let deletedMovie = await MovieModel.findByIdAndDelete({ _id:id})
        res.status(200)
        res.json({"message":"success data deleted successfully","data":deletedMovie})
    } catch (error) {
        res.status(400)
        console.log("Failed to delete data",error)
    }
    })

movieRoutes.get("/:id",authRole("USER","ADMIN"), async (req, res) => {
    const {id} = req.params
    try {
        let data = await MovieModel.findById({ _id:id})
        res.status(200)
        res.json({"message":"success data fetched successfully","data":data,})
    } catch (error) {
        res.status(400)
        console.log("Failed to fetch data",error)
    }
    })

export default movieRoutes