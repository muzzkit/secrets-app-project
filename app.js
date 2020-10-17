//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;


const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = new mongoose.model("User", userSchema);

////////////home route dclared////////////
app.route("/")
.get(function(req, res){
  res.render("home");
});
/////////////////login route declare very well ////////////////////
app.route("/login")
.get(function(req, res){
  res.render("login");
})
.post(function(req, res){
  const username = req.body.username
  const password = req.body.password
  User.findOne({email: username}, function(err, foundResult){
    if (err){
      console.log(err);
    }else{

      bcrypt.compare(password, foundResult.password, function(err, result) {
    // result == true
    if(result === true){
      res.render("secrets")
    }
});
  }
});
});

//////////////register route declare /////////////////
app.route("/register")
.get(function(req, res){
  res.render("register");
})
.post(function(req, res){

  const userPassword = req.body.password;

  bcrypt.hash(userPassword, saltRounds, function(err, hash) {

    const newUser = new User({
      email: req.body.username,
      password: hash
    });

    newUser.save(function(err){
      if(err){
        console.log(err);
      }else{
        res.render("secrets")
      }
    })
});

});





app.listen(3000, function(){
  console.log("serve is connected successfully ");
});
