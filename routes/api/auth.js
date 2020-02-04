const express =require("express");
const router = express.Router();
const bcrypt =require("bcryptjs");
const passport =require("passport");
const jsonwt=require("jsonwebtoken");
const key = require("../../setup/myurl");

//@type - GET
//@route - /api/auth
//@desc - route for auth
//@access - PUBLIC
router.get("/",(req,res)=>{
    res.json({test: "auth is success"});

})

//import schema
const Person=require("../../models/Person");

//@type - POST
//@route - /api/auth/register
//@desc - route for registration
//@access - PUBLIC
router.post("/register",(req,res)=>{
    // we are finding to ensure that the user has not register him in past
    Person.findOne({email:req.body.email})
        .then( 
            person=>{ //person is return from mongodb if it has already registered .
                      // if not then person will not be return.
             if(person){
                 return res.status(400).json({emailerror: "email already registered"})// 400 is for bad request.
             }
             else{
                 if(req.body.gender == "male")
                 {  // you can directly add value to this keys.
                    const profilepic="https://cdn.pixabay.com/photo/2018/09/15/19/23/avatar-3680134_960_720.png";
                 }
                 else{
                     const profilepic="https://cdn.pixabay.com/photo/2018/08/28/14/40/avatar-3637701_960_720.png";
                 }                  
                 const newPerson= new Person({
                     name:req.body.name,
                     email:req.body.email,
                     password:req.body.password,
                     gender:req.body.gender
                 })
                 // asyn bcrypt is recommended as for server.
                 // syn is for simple script.
                 const saltRounds = 10;//A cost factor of 10 means that the calculation is done 2^10 times which is about 1000 times. The more rounds of calculation you need to get the final hash, the more cpu/gpu time is necessary. This is no problem for calculating a single hash for a login, but it is a huge problem when you brute-force millions of password combinations.
                 bcrypt.genSalt(saltRounds,(err, salt)=> {
                    bcrypt.hash(newPerson.password, salt,(err, hash)=> {
                        if(err) throw err;
                        newPerson.password=hash;
                        newPerson
                        .save()
                        .then(person=>{
                            res.json(person);
                        }
                        )
                        .catch(err=>{
                            console.log(err);                            
                        })
                        // Store hash in your password DB.
                    });
                });

             }          

        })
        .catch(err=>{
            console.log(err);
            
        })

})
//@type - POST
//@route - /api/auth/login
//@desc - route for login
//@access - PUBLIC
router.post("/login",(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    Person.findOne({email})
        .then(person=>{
                if(!person){
                    return res.status(404).json({emailerror: "Email does not exist"});
                }
                bcrypt.compare(password,person.password)
                    .then(isCorrect=>{
                        if(isCorrect){
                            //return res.status(200).json({success:"login successfully..."});
                            const payload={
                                id: person.id,
                                name:person.name,
                                email:person.email
                            }
                            jsonwt.sign(
                                payload,   
                                key.secret,
                                {
                                    expiresIn: 60 * 60
                                },
                                (err,token)=>{
                                    res.json({
                                        success:true,
                                        token: "Bearer " + token // this syntax of token is fixed
                                    })
                                }

                            )
                        }
                        else{
                            return res.status(400).json({passworderror:"Password is not correct"});
                        }
                    })
                    .catch(err=>{
                        console.log(err);
                        
                    })
        })
        .catch(err=>{
            console.log(err);
            
        })
})
//@type - GET
//@route - /api/auth/profile
//@desc - route for profile
//@access - PRIVATE
router.get("/profile",passport.authenticate('jwt',{ session: false }),(req,res)=>{
     res.json({
         id:req.user.id,
         name:req.user.name,
         email:req.user.email,
         gender:req.user.gender,
         profilepic:req.user.profilepic
     })
})

module.exports=router;