const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const bodyparser = require("body-parser");
const config = require('dotenv').config();

const app = express();

app.set("view engine", "ejs");
app.use(bodyparser.json());
app.use(express.static("public"));
const saltRounds = 5;

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });
// const upload = multer({ storage: storage,  limits: { fileSize: 2000000 } }).single("image");

mongoose.connect("mongodb+srv://team12:"+process.env.DB_PASSWORD+"@ghumo.fldxv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db = mongoose.connection;
db.once("open", () => console.log("Connected to MongoDB"));
db.on("error", (err) => console.log(err));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userSchema = mongoose.Schema({
    name: String,
    password: String,
    email: String,
    dob: String,
});
const User = new mongoose.model("users", userSchema);


app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"public","index.html"));
})

app.get("/login",(req,res)=>{
    res.clearCookie("userEmail");
    res.sendFile(path.join(__dirname,"public","login.html"));
})

app.get("/signup",(req,res)=>{
    res.sendFile(path.join(__dirname,"public","register.html"));
})

app.get("/home",(req,res)=>{
    res.sendFile(path.join(__dirname,"public","home.html"));
})

app.get("/leaderboard",(req,res)=>{
    res.sendFile(path.join(__dirname,"public","leaderboard.html"));
})

app.get("/destination",(req,res)=>{
    res.sendFile(path.join(__dirname,"public","destination.html"));
})

app.get("/publicProfile",(req,res)=>{
    res.sendFile(path.join(__dirname,"public","publicProfile.html"));
})

app.get("/myProfile",(req,res)=>{
    res.sendFile(path.join(__dirname,"public","myProfile.html"));
})

// CREATING ACCOUNT
app.post("/register", async (req, res) => {
    const user = await User.findOne({email:req.body.email});
    if(user){
        res.send('Account already exists');
    }
    else{
    let plainPassword = req.body.password;
    bcrypt.hash(plainPassword, saltRounds, (err, hashedPassword) => {
      if (err) throw err;
      signupDetails = {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        dob: req.body.dob,
      };
      User.create(signupDetails, (err, response) => {
        if (err) {
          res.status(500).send();
        } else {
          res.send('Account successfully created!');
        }
      });
    });
  }
  });

  // LOGIN
  app.post("/home", (req, res) => {
    loginDetails = {
      email: req.body.email,
      password: req.body.password,
    };
    User.find({ email: loginDetails.email }, (err, response) => {
      if (err) throw err;
      else {
        if (Object.entries(response).length === 0) {
          res.send('Account not found! Please Register.');
        } else {
          bcrypt.compare(loginDetails.password, response[0].password, (error, resp) => {
            if (error) throw error;
            if (resp === true) {
              res.cookie("userEmail", loginDetails.email);
              res.sendFile(path.join(__dirname, "public", "home.html"));
            } else {
              res.send("Wrong Password!");
            }
          });
        }
      }
    });
  });




app.use(express.static(path.join(__dirname, "public")));
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));