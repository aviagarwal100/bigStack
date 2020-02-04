const express =require("express");
const router = express.Router();
const mongoose=require("mongoose");
const passport=require("passport");


//loading the Person schema...
const Person=require("../../models/Person");


// loading the Profile schema...
const Profile=require("../../models/Profile");

// loading the Question schema...
const Question=require("../../models/Question");


//@type - GET
//@route - /api/questions
//@desc - route for displaying all the questions
//@access - PUBLIC
router.get("/",(req,res)=>{
    Question.find().sort({date:"desc"}).then(question=>{
        res.json(question);
    }).catch(err=>{
        res.json({questionerror:"questions are not available"});
    })

})

//@type - POST
//@route - /api/questions/
//@desc - route for posting the questions
//@access - PRIVATE
router.post("/",passport.authenticate("jwt",{session:false}),(req,res)=>{
    const newquestion=new Question({
        user:req.user.id,
        textone:req.body.textone,
        texttwo:req.body.texttwo,
        name:req.body.name        
    })
    newquestion.save().then(question=>res.json(question)).catch(err=>res.json({questionerror:"Error in adding new question"}));
})
//@type - POST
//@route - /api/questions/answers/:id
//@desc - route for posting the answers
//@access - PRIVATE
router.post("/answers/:id",passport.authenticate("jwt",{session:false}),(req,res)=>{
    Question.findById({_id:req.params.id}).then(question=>{
        const answer={
            user:req.user.id,
            text:req.body.text
        };
        question.answers.unshift(answer)
        question.save().then(question=>{
            res.json(question)
        }).catch(err=>console.log(err));
    }).catch(err=>{
        console.log(err);
        
    })
})
//@type - POST
//@route - /api/questions/upvotes/:id
//@desc - route for upvoting the questions
//@access - PRIVATE
router.post("/upvotes/:id",passport.authenticate("jwt",{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id}).then(profile=>{
        Question.findById({_id:req.params.id}).then(question=>{
            if(question.upvotes.filter(upvotes=>upvotes.user.toString()===req.user.id.toString()).length>0){
                return res.status(400).json({noVotes:"You have already voted this question"})
            }
            question.upvotes.unshift({user:req.user.id})
            question.save()
                .then(question=>res.json(question))
                .catch(err=>console.log(err))

        }).catch(err=>console.log(err))
    }).catch(err=>console.log(err))
})
//@type - POST
//@route - /api/questions/devotes/:id
//@desc - route for devoting the questions
//@access - PRIVATE
router.post("/devotes/:id",passport.authenticate("jwt",{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id}).then(profile=>{
        Question.findById({_id:req.params.id}).then(question=>{
            //toString() is used here because === compare both value and data type ,so for that.
            // we use this to make data type same. 
            if(question.upvotes.filter(upvotes=>upvotes.user.toString()===req.user.id.toString()).length>0){
                question.upvotes.pop({user:req.user.id})
                question.save()
                .then(question=>res.json(question))
                .catch(err=>console.log(err))                
            }
            else{
                return res.json({deVoteError:"You have no vote , that can be remove"});
            }
            

        }).catch(err=>console.log(err))
    }).catch(err=>console.log(err))
})
//@type - GET
//@route - /api/questions/delete/:id
//@desc - route for deleting the question
//@access - PRIVATE
router.get("/delete/:id",passport.authenticate("jwt",{session:false}),(req,res)=>{
    Question.findByIdAndDelete({_id:req.params.id})
        .then(question=>res.json(question))
        .catch(err=>console.log(err));
})
//@type - GET
//@route - /api/questions/deleteAll
//@desc - route for deleting the questions
//@access - PRIVATE
router.get("/deleteAll",passport.authenticate("jwt",{session:false}),(req,res)=>{  
    Question.deleteMany({user:req.user.id})
       .then(question=>res.json({success:"All the questions are deleted"}))
       .catch(err=>console.log(err))
})



module.exports=router;