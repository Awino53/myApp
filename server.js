const express = require("express")

const app = express()

app.use(express.static ("public"))//serve static 

app.get("/", (req,res)=>{
    res.render("index.ejs")
})



//page not found
app.get("*",(req,res)=>{
    res.status(404) .render("404.ejs")
})

//start
app.listen(3500,()=> console.log("server running on port 3500"))