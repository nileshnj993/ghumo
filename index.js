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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/itineraries");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage}).single('itinerary');

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
    picture: {
      type: String,
      default:"img/user-icon.png"
    },
    ranking:{
      type:Number,
      default:0
    },
    points:{
      type:Number,
      default:0
    },
    itineraries:[
      {
        destination:String,
        points:Number,
        link:String
      }
    ],
   
});
const User = new mongoose.model("users", userSchema);

const destinationSchema = mongoose.Schema({
    name:String,
    desc:String,
    itineraries:[
      {
        user:String,
        userEmail:String,
        points:Number,
        link:String
      }
    ]
});
const Destination = new mongoose.model("destination", destinationSchema);

const itinerarySchema = mongoose.Schema({
    user:String,
    destination:String,
    points:Number,
    link:String
})
const Itinerary = new mongoose.model("itinerary", itinerarySchema);

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
  var mySort = {points:-1};
  User.find({}, (err, response) => {
    var data = response;
    res.render("leaderboard",{data:data});
  }).sort(mySort);  
})

app.get("/myProfile",(req,res)=>{
  User.find({ email: req.cookies.userData.userEmail}, (err, response) => {
    var data = response[0];
    res.render("myProfile",{data:data});
  });
})

app.get("/publicProfile",(req,res)=>{
    res.sendFile(path.join(__dirname,"public","publicProfile.html"));
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
        itineraries:[],
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
          bcrypt.compare(loginDetails.password, response[0].password, async (error, resp) => {
            if (error) throw error;
            if (resp === true) {
              const user = await User.findOne({email:loginDetails.email});
              const name = user.name;
              res.cookie("userData", {
                  userEmail:user.email,
                  userName: name
              });
              res.sendFile(path.join(__dirname, "public", "home.html"));
            } else {
              res.send("Wrong Password!");
            }
          });
        }
      }
    });
  });


  app.post("/uploadItinerary", (req, res) => {
    let itineraryPath;
    let note;
    upload(req, res, (err) => {
     
        itineraryPath = "itineraries/" + req.file.filename;
        
        note = { // Itinerary
          user:  req.cookies.userData.userEmail,
          destination: req.body.destination,
          points: 0,
          link: itineraryPath, 
        };

        note2 = { // Destination
          user:req.cookies.userData.userName,
          userEmail:  req.cookies.userData.userEmail,
          points: 0,
          link: itineraryPath, 
        };

        note3 = { // User
          destination: req.body.destination,
          points: 0,
          link: itineraryPath, 
        };

        Itinerary.create(note, (err, response) => {
          if (err) res.status(500).send();
          Destination.updateOne({ name: req.body.destination }, { $push: { itineraries: note2 } }, (err, response) => {
            if (err) throw err;
            else {
              User.updateOne({ email: req.cookies.userData.userEmail }, { $push: { itineraries: note3 } }, (err, response) => {
              res.send('Itinerary Created Successfully!');
            });
          }
        });
      });
    });
  });
  
  app.get("/:location",(req,res)=>{
    Destination.find({ name: req.params.location}, (err, response) => {
        var data = response[0];
        res.render("destination",{data:data});
    });
})

app.use(express.static(path.join(__dirname, "public")));
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));