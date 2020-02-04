const mongoose=require("mongoose")
const Schema= mongoose.Schema


const AnswerOfLinux=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"myPerson"
    },
    text:{
        type:String,
        require:true
    },
    loves:[
        {
            user:{
                type:Schema.Types.ObjectId,
                ref:"myPerson"
            }
        }
    ],
    q_id:{
        type:Schema.Types.ObjectId,
        ref:"myLinuxQuestion"

    },
    date:{
        type:Date,
        default:Date.now
    }
})
module.exports=LinuxAnswer=mongoose.model("myLinuxAnswer",AnswerOfLinux);