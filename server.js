var express = require("express");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require("cors");
var morgan = require("morgan");
const mongoose = require("mongoose");
var bcrypt = require("bcrypt-inzi")
var jwt = require('jsonwebtoken');
var path = require("path");
var ZUserModel = "./routes/models.js";
var app = express();

////////////////////////////////////////////////////////////
//////////////////////////////MODELS////////////////////////////////////////////////////////////

var dbURI = "mongodb+srv://chaters:1111@zar.r0ctt.mongodb.net/zar?retryWrites=true&w=majority";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', function () {
    console.log('mongoose connect ho chuka hai')
});
mongoose.connection.on('disconnected', function () {
    console.log('mongoose disconnect hogaya');
    process.exit(1);
});
mongoose.connection.on('error', function () {
    console.log('koi error hai');
    process.exit(1);
});
process.on('SIGINT', function () {
    console.log('app terminate horahi hai');

    mongoose.connection.close('terminating', function () {

        console.log('app close hoagai hai');
        process.exit(0);
    });
});
///////////////////////////////////END///////////////////////////////////////////////////////////////////

///////////////////////////////////USER MODEL/////////////////////////////////////////////////////////////
var ZUserSchema = new mongoose.Schema({
    "name": string,
    "fName": string,
    "email": string,
    "password": string,
    "phone": string,
    "gender": string,
    "createdOn": { "type": Date, "default": Date.now },
    "activeSince": Date
});

var ZUserModel = mongoose.model("zaryabUser", ZUserSchema);

////////////////////////////////////END///////////////////////////////////////////////////////////////

/////////////////////////////////////OTP MODEL///////////////////////////////////////////////////////////

// var ZOtpSchema = new mongoose.Schema({



// })

////////////////////////////////    CALLINGS    ///////////////////////////////////////////////////////////////

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(cookieParser())

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////           SIGN UP         //////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////

app.post("/signup", (req, res, next) => {
    if (!req.body.name
        || !req.body.fName
        || !req.body.email
        || !req.body.password
        || !req.body.phone
        || !req.body.gender) {

        res.status(403).send(`please send name, father name, email, passwod, phone and gender in json body`)
        return;
    }
    ZUserModel.findOne({ email: req.body.email },
        function (err, doc) {
            if (!err && !doc) {

                bcrypt.stringToHash(req.body.password).then(function (hash) {

                    var ZNewUser = new userModel({
                        "name": req.body.name,
                        "fName": req.body.fName,
                        "email": req.body.email,
                        "password": hash,
                        "phone": req.body.phone,
                        "gender": req.body.gender,
                    })
                    ZNewUser.save((err, data) => {
                        if (!err) {
                            res.send({
                                message: "user created"
                            })
                        } else {
                            console.log(err);
                            res.status(500).send({ message: "user create error, " + err })
                        }
                    });
                })

            } else if (err) {
                res.status(500).send({
                    message: "db error"
                })
            } else {
                res.status(409).send({
                    message: "user already exist"
                })
            }
        })


})
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("server is running on: ", PORT);
})