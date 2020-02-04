const express =require("express");
const router = express.Router();
const mongoose=require("mongoose");
const passport=require("passport");

// loading the Person schema...
const Person=require("../../models/Person");
// loading the Profile schema...
const Profile=require("../../models/Profile");


//@type - GET
//@route - /api/profile
//@desc - route for profile
//@access - PRIVATE
router.get("/",passport.authenticate("jwt",{session:false}),(req,res)=>{
    Profile.findOne({id:req.user.id}).then(profile=>{
        if(!profile){
           return res.status(404).json({profileError:"Profile Not Found"});
        }
        res.json(profile);
    }).catch(err=>{
        console.log(err);
        
    })
} )

//@type - POST
//@route - /api/profile
//@desc - route for UPDATING/SAVING profile
//@access - PRIVATE
router.post("/",passport.authenticate("jwt",{session:false}),(req,res)=>{
    const profiledetails={};
    profiledetails.user=req.user.id;
    if(req.body.username) profiledetails.username=req.body.username;
    if(req.body.country) profiledetails.country=req.body.country;
    if(req.body.portfolio) profiledetails.portfolio=req.body.portfolio;
    if(req.body.website) profiledetails.website=req.body.website;
    if(typeof req.body.languages != undefined) {
        profiledetails.languages=req.body.languages.split(",");
    }
    profiledetails.social={}
    if(req.body.youtube) profiledetails.social.youtube=req.body.youtube;
    if(req.body.facebook) profiledetails.social.facebook=req.body.facebook;
    if(req.body.instagram) profiledetails.social.instagram=req.body.instagram;
    //Do save it in database
    Profile.findOne({user: req.user.id})
        .then(profile=>{           
            //username problem solved...
            if(profile){   
                Profile.findOne({ $and: [ { username:profiledetails.username }, { user: { $ne: req.user.id } } ] } ).then(profile=>{
                    if(profile){
                        return res.status(400).json({usernameError:"username already exists"});
                    }
                    else{
                        Profile.findOneAndUpdate({user:req.user.id},{$set:profiledetails},{new:true})
                .then(profile=>res.json(profile))
                .catch(err=>console.log(err)
                )

                    }
                })            
            
        }
        else{
            Profile.findOne({username:profiledetails.username})
            .then(profile=>{
                // username already exist
                if(profile){
                    res.status(400).json({usernameError:"username already exists"});
                    // Don't return as we have to save the data in database so that user can see his filled details.
                }
                new Profile(profiledetails)
                .save()
                .then(profile=>res.json(profile))
                .catch(err=>console.log(err))
             
            })
            .catch(err=>console.log(err))
        }
    })
        .catch(err=>console.log(err)
    )

})
//@type - GET
//@route - /api/profile/:username
//@desc - route for username access
//@access - PUBLIC
router.get("/:username",(req,res)=>{
    Profile.findOne({username:req.params.username})
        .populate("user",["name","profilepic"])
        .then(profile=>{
            if(!profile){
                res.status(404).json({usernameError:"Username doesn't exist"});
            }
            res.json(profile);

        })
        .catch(err=>console.log(err));
})
//@type - GET
//@route - /api/profile/id/:id
//@desc - route for id access
//@access - PUBLIC
router.get("/id/:id",(req,res)=>{
    //use /id/:id as if we don't use it then it will consider the above username route .
    // for this request and which wrong to define it different from other route we .
    // use this /id/:id syntax.    
    Profile.findOne({_id:req.params.id})// use _id as it is in database.
        .populate("user",["name","profilepic"])
        .then(profile=>{
            if(!profile){
                res.status(404).json({idError:"Id doesn't exist"});
            }
            res.json(profile);

        })
        .catch(err=>console.log(err));

})
//@type - GET
//@route - /api/profile/find/everyone
//@desc - route for accessing everyone's profile
//@access - PUBLIC
router.get("/find/everyone",(req,res)=>{
    Profile.find()
        .populate("user",["name","profilepic"])
        .then(profiles=>{
            if(!profiles){
                res.status(404).json({findError:"No profile exist"});
            }
            res.json(profiles);

        })
        .catch(err=>console.log(err));
})
//@type - DELETE
//@route - /api/profile/
//@desc - route for deleting the profile
//@access - PRIVATE
router.delete("/",passport.authenticate("jwt",{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id})
    Profile.findOneAndDelete({user:req.user.id})
        .then(()=>Person.findOneAndDelete({_id:req.user.id})
            .then(()=>res.json({success:"Delete is a success"}))
            .catch(err=>console.log(err))    
            )
        .catch(err=>console.log(err))
})
// In database only directValue,object,nestedObject and array move .


//@type - POST
//@route - /api/profile/workrole
//@desc - route for adding workrole
//@access - PRIVATE
router.post("/workrole",passport.authenticate("jwt",{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id})
        .then(profile=>{
            if(!profile){
                res.json({error:"profile doesn't exist"});
                }
            const newWork={
                role:req.body.role,
                country:req.body.country,
                company:req.body.company,
                current:req.body.current,
                details:req.body.details
            }            
            profile.workrole.unshift(newWork);
            //unshift save the object at the top
            // push save the object at the end.
            profile.save()
                .then(profile=>res.json(profile))
                .catch(err=>console.log(err))
            }
        )
        .catch(err=>console.log(err))

})
//@type - DELETE
//@route - /api/profile/workrole/:w_id
//@desc - route for deleting the workrole
//@access - PRIVATE
router.delete("/workrole/:w_id",passport.authenticate("jwt",{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id})
    .then(profile=>{
        if(!profile){
            res.json({error:"profile doesn't exist"})
        }
        const removeThis=profile.workrole.map(item=>item.id).indexOf(req.params.w_id);
        profile.workrole.splice(removeThis,1);
        profile.save()
                .then(profile=>res.json(profile))
                .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})

module.exports=router;