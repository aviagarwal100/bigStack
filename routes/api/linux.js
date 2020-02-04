const express =require("express");
const router = express.Router();
const mongoose=require("mongoose");
const passport=require("passport");

//loading the Person schema...
const Person=require("../../models/Person");


// loading the Profile schema...
const Profile=require("../../models/Profile");

// loading the LinuxQuestion schema...
const LinuxQuestion=require("../../models/LinuxQuestion");

// loading the Comment schema...
const Comment=require("../../models/Comment");
// loading the LinuxAnswer schema...
const LinuxAnswer=require("../../models/LinuxAnswer");


//@type - POST
//@route - /api/linuxQuestion/
//@desc - route for posting the questions
//@access - PRIVATE
router.post("/",passport.authenticate("jwt",{session:false}),(req,res)=>{
    const newquestion=new LinuxQuestion({
        user:req.user.id,
        textone:req.body.textone,
        texttwo:req.body.texttwo,
        textthree:req.body.textthree,
        name:req.body.name        
    })
    newquestion.save().then(question=>res.json(question)).catch(err=>res.json({questionerror:"Error in adding new question"}));
})
//@type - GET
//@route - /api/linuxQuestion/
//@desc - route for displaying all the questions
//@access - PUBLIC
router.get("/",(req,res)=>{
    LinuxQuestion.find().sort({date:"desc"}).then(question=>{
        res.json(question);
    }).catch(err=>{
        res.json({questionerror:"questions are not available"});
    })

})
//@type - POST
//@route - /api/linuxQuestion/:id/answers
//@desc - route for posting the answers
//@access - PRIVATE
router.post("/:id/answers",passport.authenticate("jwt",{session:false}),(req,res)=>{
   LinuxQuestion.findById({_id:req.params.id}).then(question=>{
        const answer=new LinuxAnswer({
            user:req.user.id,
            text:req.body.text,
            q_id:question._id
        });
        answer.save()
            .then(ans=>res.json(ans))
            .catch(err=>console.log(err))        
    }).catch(err=>{
        console.log(err);
        
    })
})
//@type - POST
//@route - /api/linuxQuestion/loves/:id
//@desc - route for love the questions
//@access - PRIVATE
router.post("/loves/:id",passport.authenticate("jwt",{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id}).then(profile=>{
        LinuxQuestion.findById({_id:req.params.id}).then(question=>{
            if(question.loves.filter(loves=>loves.user.toString()===req.user.id.toString()).length>0){
                return res.status(400).json({noMoreLoves:"You have already loved this question"})
            }
            question.loves.unshift({user:req.user.id})
            question.save()
                .then(question=>res.json(question))
                .catch(err=>console.log(err))

        }).catch(err=>console.log(err))
    }).catch(err=>console.log(err))
})
//@type - POST
//@route - /api/linuxQuestion/hates/:id
//@desc - route for hate the questions
//@access - PRIVATE
router.post("/hates/:id",passport.authenticate("jwt",{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id}).then(profile=>{
        LinuxQuestion.findById({_id:req.params.id}).then(question=>{
            //toString() is used here because === compare both value and data type ,so for that.
            // we use this to make data type same. 
            if(question.loves.filter(loves=>loves.user.toString()===req.user.id.toString()).length>0){
                question.loves.pop({user:req.user.id})
                question.save()
                .then(question=>res.json(question))
                .catch(err=>console.log(err))                
            }
            else{
                return res.json({hateError:"You have no love , that can be remove"});
            }
            

        }).catch(err=>console.log(err))
    }).catch(err=>console.log(err))
})
//@type - GET
//@route - /api/linuxQuestion/delete/:id
//@desc - route for deleting the question
//@access - PRIVATE
router.get("/delete/:id",passport.authenticate("jwt",{session:false}),(req,res)=>{
    LinuxQuestion.findByIdAndDelete({_id:req.params.id})
        .then(question=>res.json(question))
        .catch(err=>console.log(err));
})
//@type - GET
//@route - /api/linuxQuestion/deleteAll
//@desc - route for deleting all the question
//@access - PRIVATE
router.get("/deleteAll",passport.authenticate("jwt",{session:false}),(req,res)=>{  
    LinuxQuestion.deleteMany({user:req.user.id})
       .then(question=>res.json({success:"All the questions are deleted"}))
       .catch(err=>console.log(err))
})
//@type - POST
//@route - /api/linuxQuestion/question/:id/comment
//@desc - route for posting the comment
//@access - PRIVATE
router.post("/question/:id/comment", passport.authenticate("jwt",{session:false}),(req,res)=>{
            const comment=new Comment({
                user:req.user.id,
                text:req.body.text,
                q_id:req.params.id
            })
            comment.save()
                .then(comment=>{
                    res.json(comment)
                })
                .catch(err=>console.log(err))
}) 
//@type - GET
//@route - /api/linuxQuestion/comment/delete/:id
//@desc - route to delete the comment
//@access - PRIVATE
router.get("/comment/delete/:id", passport.authenticate("jwt",{session:false}),(req,res)=>{
    Comment.findByIdAndDelete({_id:req.params.id})
        .then(()=>{
            res.json({success:"Your comment has been deleted"})
        })
        .catch(err=>console.log(err))
})
//@type - POST
//@route - /api/linuxQuestion/answers/loves/:id
//@desc - route for love the answers
//@access - PRIVATE
router.post("/answers/loves/:id",passport.authenticate("jwt",{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id}).then(profile=>{
        LinuxAnswer.findById({_id:req.params.id})
            .then(ans=>{
                if(ans.loves.filter(loves=>loves.user.toString()===req.user.id.toString()).length>0){
                    return res.status(400).json({noMoreLoves:"You have already loved this answer"})
                }
                ans.loves.unshift({user:req.user.id})
                ans.save()
                    .then(answer=>res.json(answer))
                    .catch(err=>console.log(err))

            }).catch(err=>console.log(err))
    })
})

//@type - POST
//@route - /api/linuxQuestion/answers/hates/:id
//@desc - route for hate the answers
//@access - PRIVATE
router.post("/answers/hates/:id",passport.authenticate("jwt",{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id}).then(profile=>{
        LinuxAnswer.findById({_id:req.params.id})
            .then(ans=>{
                if(ans.loves.filter(loves=>loves.user.toString()===req.user.id.toString()).length>0){
                    ans.loves.pop({user:req.user.id})
                    ans.save()
                    .then(answer=>res.json(answer))
                    .catch(err=>console.log(err))
                } 
                else{               
                return res.status(400).json({hateError:"You have no love , that can be remove"})
                }
            }).catch(err=>console.log(err))
    })
})
// Each object of an array of object has unique _id created by mongodb.


//@type - GET
//@route - /api/linuxQuestion/answer/delete/:id
//@desc - route to delete the answer
//@access - PRIVATE
router.get("/answer/delete/:id", passport.authenticate("jwt",{session:false}),(req,res)=>{
    LinuxAnswer.findByIdAndDelete({_id:req.params.id})
        .then(()=>{
            res.json({success:"Your answer has been deleted"})
        })
        .catch(err=>console.log(err))
})


module.exports=router;