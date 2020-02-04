var JwtStrategy = require('passport-jwt').Strategy;
var  ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose=require("mongoose");
const passport=require("passport");
const person= mongoose.model("myPerson");
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = require("../setup/myurl").secret;
module.exports=passport=>{ // use passport callback function , not given in the document
passport.use(new JwtStrategy(opts,(jwt_payload, done)=> {
    person.findById(jwt_payload.id).then(user=>{ // in this find by id do not use object as given in the document
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    }).catch(err=>console.log(err));
    
}))};