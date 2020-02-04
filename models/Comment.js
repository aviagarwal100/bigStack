const mongoose= require("mongoose");
const Schema = mongoose.Schema;

const CommentQuestionAnswer = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"myPerson"
    },
    text:{
        type:String,
        required:true
    },
    q_id:{
        type:Schema.Types.ObjectId,
        ref:"myLinuxQuestion"
    }
})
module.exports=Comment=mongoose.model("myComment",CommentQuestionAnswer);