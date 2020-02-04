const mongoose= require("mongoose");
const Schema = mongoose.Schema;

const LinuxQuestionSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"myPerson"
    },
    textone:{
        type:String,
        required:true
    },
    texttwo:{
        type:String,
        required:true
    },
    textthree:{
        type:String,
        required:true
    },
    name:{
        type:String
    },    
    loves:[{
        user:{
            type:Schema.Types.ObjectId,
            ref:"myPerson"
        }
    }
    ],
    
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports=LinuxQuestion=mongoose.model("myLinuxQuestion",LinuxQuestionSchema);