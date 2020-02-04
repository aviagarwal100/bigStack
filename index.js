const express=require("express");
const mongoose = require("mongoose");
const passport=require("passport");
const bodyparser=require("body-parser");
const db =require("./setup/myurl").mongodbURL;
const port= process.env.PORT || 3000;
const app=express();
const auth=require("./routes/api/auth");
const profile=require("./routes/api/profile");
const questions=require("./routes/api/questions");
const linux=require("./routes/api/linux");
// IP address may be change by antivirus as proxy so update IP address if problem in connection
mongoose.connect(db,{ useNewUrlParser: true,useUnifiedTopology: true}).then(()=>{
    console.log("mongobd connected successfully...");
    
}).catch(err=>{
    console.log(err);
    
});

// passport middleware
app.use(passport.initialize());
// passport-jwt configuration...
require("./Strategies/passportjwt")(passport);


app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());
// route for testing ...
app.get("/",(req,res)=>{
    res.send("Hey bigStack");
    
})
// actual route ...
app.use("/api/auth",auth);
app.use("/api/profile",profile);
app.use("/api/questions",questions);
app.use("/api/linuxQuestion",linux);


app.listen(port,()=>{
    console.log(`Server is running at ${port}`);    
})
