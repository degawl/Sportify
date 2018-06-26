require("dotenv").config();

var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Court       = require("./models/court"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds");

var commentRoutes = require("./routes/comments"),
    courtRoutes   = require("./routes/courts"),
    indexRoutes   = require("./routes/index");
    
    console.log(process.env.DATABASEURL);
mongoose.connect(process.env.DATABASEURL);
//mongoose.connect("mongodb://devon:antihero123@ds119651.mlab.com:19651/sportify");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();  

app.use(require("express-session")({
    secret: "Once again another penguin marches",
    resave: false,
    saveUninitialized: false
}));

app.locals.moment = require('moment');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use(indexRoutes);
app.use("/courts/:id/comments", commentRoutes);
app.use("/courts", courtRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Sportify has started");
});