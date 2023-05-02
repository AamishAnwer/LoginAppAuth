//jshint esversion:6
require("dotenv").config(); // using this to prevent to see if we pubish our application anyone can access to app.js and can see long string and encrypted pluggin
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { log } = require("console");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose =require ("passport-local-mongoose");

// const encrypt = require("mongoose-encryption");   //cmtd bcz now using hash which is level 3
// const md5 = require("md5");  // cmtd bcz now using level 4 brypt
// const bcrypt = require("bcrypt");
// const saltRounds = 10; //cmtd bcz using level 5 cookies and sessions passport

const { isAsyncFunction } = require("util/types");
mongoose.set("strictQuery", false);

const app = express();

// console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);

//
// main().catch((err) => console.log(err));
// async function main() {
// 	await mongoose.connect("mongodb+srv://aamishanwer:Test%40123@cluster1.wfahfhw.mongodb.net/todolistDB");
// // }

// using session
app.use(
	session({
		secret: "our little secret.",
		resave: false,
		saveUninitialized: false,
	})
);
// always below session we'll initialize and start passport
app.use(passport.initialize());
app.use(passport.session());

main().catch((err) => console.log(err));
async function main() {
	mongoose.connect("mongodb://127.0.0.1/userDB");
}

const userSchema = new mongoose.Schema({
	email: String,
	password: String
});

//below user schema always adding last package passport-Local mongoose as a plugin

userSchema.plugin(passportLocalMongoose); //using this line of code to hash and salt the password in mongodb database

// creating a long unguessable string
// const secret = "Thisisourlittlesecret";   // cut and paste in .env
// now we are ready to use that secret to encrypt our database
// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });  //changed secret to process.env.SECRET bcz secret is not defined error we were getting //cmtd bcz using hash

// we'll have to add this schema before model bcz in model we're passing in the userschema as a parameter to create our new mongoose model

const User =new mongoose.model("User", userSchema);

// confituring the passport-Local mongoose right below the model
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function (req, res) {
	res.render("home");
});

app.get("/login", function (req, res) {
	res.render("login");
});

app.get("/register", function (req, res) {
	res.render("register");
});

// creating this bcz  using passport local mongoose to register
app.get("/secrets", function(req, res){
	if (req.isAuthenticated()){
		res.render("secrets");
	} else {
		res.redirect("/login");
	}
});

// for logout using passport local mongoose to logout

// app.get("/logout", function(req, res){
// 	req.logout();
// 	res.redirect("/")
// });
app.get('/logout', function(req, res, next) {
	req.logout(function(err) {
			if (err) { return next(err); }
			res.redirect('/');
	});
});

app.post("/register", function (req, res) {
	// bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
	// 	// Store hash in your password DB.
	// 	const newUser = new User({
	// 		email: req.body.username,
	// 		// password: md5(req.body.password) // added md5 bcz of hashing 3rd method
	// 		password: hash, //bcz of bcrypt
	// 	});
	// 	newUser.save(function (err) {
	// 		if (err) {
	// 			console.log(err);
	// 		} else {
	// 			res.render("secrets");
	// 		}
	// 	});
	// });
	// commented bcz using passport cookies and session

// now using passport local mongoose to register


User.register({username: req.body.username}, req.body.password, function(err, user){
	if(err) {
		console.log(err);
		res.redirect("/register")
	} else {
		passport.authenticate("local") (req, res, function(){
			res.redirect("/secrets");
		});
	}
});


});

app.post("/login", function (req, res) {
	// const username = req.body.username;
	// //  const password = md5(req.body.password);  //added md5 bcz of hashing //removed md5 bcz of bcrypt
	// const password = req.body.password;
	// User.findOne({ email: username }, function (err, foundUser) {
	// 	if (err) {
	// 		console.log(err);
	// 	} else {
	// 		if (foundUser) {
	// 			// Load hash from your password DB.
	// 			bcrypt.compare(password, foundUser.password, function (err, result) {
	// 				// result == true
	// 				if (result === true) {
	// 					res.render("secrets");
	// 				}
	// 			});
	// 		}
	// 	}
	// });
	// commented bcz using passport cookies and session

	const user = new User({
		username: req.body.username,
		password: req.body.password
	});
	// now using passport local mongoose to login

req.login(user, function(err){
	if(err) {
		console.log(err);
	} else {
		passport.authenticate("local") (req, res, function(){
			res.redirect("/secrets");
	});
}


});
});

app.listen(3000, function () {
	console.log("Server started at port 3000 yayyyyyy!!!!!!!!!!!!1");
});
