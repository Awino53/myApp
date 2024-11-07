//const { render } = require("ejs")
const express = require("express")

const app = express()

app.use(express.static ("public"))//serve static 

 
app.get("/", (req,res)=>{
    res.render("index.ejs")
})



//signing in buttons
app.post("/register", (req,res)=>{
    res.render("register.ejs")
})

app.get("/signin", (req,res)=>{
    res.render("signin.ejs")
})

app.post("/login",(req,res)=>{
    res.render("login.ejs")
})

app.get("/login",(req,res)=>{
    res.render("login.ejs")
})

app.get("/home", (req,res)=>{
    res.render("home.ejs")
})


app.get("/categories", (req,res)=>{
    res.render("categories.ejs")
})

app.get("/targets", (req,res)=>{
    res.render("targets.ejs")
})

app.get("/reports", (req,res)=>{
    res.render("reports.ejs")
})

app.get("/profile", (req,res)=>{
    res.render("profile.ejs")
})


//footer landing page
app.get("/terms",(req,res)=>{
    res.render("terms.ejs")
})
app.get("/policy",(req,res)=>{
    res.render("policy.ejs")
})
app.get("/contact",(req,res)=>{
    res.render("contact.ejs")
})
app.get("/faqs",(req,res)=>{
    res.render("faqs.ejs")
})


//page not found
app.get("*",(req,res)=>{
    res.status(404) .render("404.ejs")
})

//start
app.listen(3500,()=> console.log("server running on port 3500"))