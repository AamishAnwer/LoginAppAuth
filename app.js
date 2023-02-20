//jshint esversion:6
require('dotenv').config();  // using this to prevent to see if we pubish our application anyone can access to app.js and can see long string and encrypted pluggin
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { log } = require("console");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const { isAsyncFunction } = require("util/types");
mongoose.set('strictQuery', false);

const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true 
 }));

// 
// main().catch((err) => console.log(err));
// async function main() {
// 	await mongoose.connect("mongodb+srv://aamishanwer:Test%40123@cluster1.wfahfhw.mongodb.net/todolistDB");
// // }


main().catch((err) => console.log(err));
async function main(){
mongoose.connect("mongodb://127.0.0.1/userDB");
}


const userSchema = new mongoose.Schema({
 email: String,
 password: String
});

// creating a long unguessable string
// const secret = "Thisisourlittlesecret";   // cut and paste in .env
// now we are ready to use that secret to encrypt our database
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });  //changed secret to process.env.SECRET bcz secret is not defined error we were getting

// we'll have to add this schema before model bcz in model we're passing in the userschema as a parameter to create our new mongoose model

const User = mongoose.model("User", userSchema);


 app.get("/", function(req, res){
  res.render("home");
 });

 app.get("/login", function(req, res){
  res.render("login");
 });

 app.get("/register", function(req, res){
  res.render("register");
 });



app.post("/register",  function(req, res){
 const newUser = new User({
  email: req.body.username,
  password: req.body.password
 });

 newUser.save(function(err){
  if (err) {
   console.log(err);
  } else {
   res.render("secrets");
  }  
 });
});



app.post("/login", function(req, res){
 const username = req.body.username;
 const password = req.body.password;

 User.findOne({email: username}, function(err, foundUser){
  if (err) {
   console.log(err);
  } else {
   if (foundUser) {
    if (foundUser.password === password) {
     res.render("secrets")
    }
    else {
     console.log("Username or password is invalid!")
    }
   }
  }

 });
});













 app.listen(3000, function(){
  console.log("Server started at port 3000 yayyyyyy!!!!!!!!!!!!1");
 })















 
