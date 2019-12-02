const mongoose = require("mongoose");
const alert = require('alert-node');
const express = require("express");
const bodyParser = require("body-parser");
const app = express()
const dburi = "mongodb+srv://Admin01:Admin01@cluster0-mfweq.mongodb.net/test?retryWrites=true&w=majority";
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('index.html'))

mongoose.connect(dburi, { useNewUrlParser: true }).catch(err => {
    console.log("error occured", err);
});
mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
})
mongoose.connection.on("connected", () => {
    console.log("Connected with database");
});

mongoose.connection.on("disconnected", () => {
    console.log("Disconnected with database.");
    process.exit(1);
});

var nameSchema = new mongoose.Schema({
    UserName: String,
    Password: 'String'
});
var User = mongoose.model("User", nameSchema);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
app.get("/signup", (req, res) => {
    res.sendFile(__dirname + "/signup.html")
})

app.post("/login", async (req, res) => {
    User.find({ UserName: req.body.UserName, Password: req.body.Password }).then(d => {
        if (d.length == 0) {
            res.send(alert("Signup First")).sendFile(__dirname + "/index.html");
            // var uN = UserName;
            // res.send(`https://serverisnotfound.herokuapp.com/webhook`)
        }
        else {
            res.sendFile(__dirname + "/login.html")
            console.log("data is : ", d)
        }
    }).catch(e => {
        res.send("Something went wrong !")
        console.log("err is : ", e)
    })
})

app.post("/signup", async (req, res) => {
    var info = {
        UserName: req.body.UserName,
        Password: req.body.Password
    }
    var saveData = new User(info);
    await saveData.save()
        .then(item => {
            res.send("Signup Successfull");
            console.log("data is  : ", item)
        })
        .catch(err => {
            console.log("err is : ", err)
            res.send(200, "Unable to save to database");
        });
})
app.listen(process.env.PORT || 4000, () => {
    console.log("server running")
})