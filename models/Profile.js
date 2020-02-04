const mongoose = require("mongoose");
const Schema =  mongoose.Schema;
const ProfileSchema = new Schema({
    user:{
        // anchor point which is use as referrence to user here it is user's id.
        type:Schema.Types.ObjectId,
        ref:"myPerson"
    },
    username:{
        type:String,
        required:true
    },
    website:{
        type:String
    },
    country:{
        type:String,
        required:true
    },
    languages:{
        type:[String],
        required:true
    },
    portfolio:{
        type:String
    },
    // Here array of object means that each value of array comprise of defined object.
    workrole:[{
        role:{
            type:String,
            required:true
            },
        company:{
            type:String,
            required:true
        },
        country:{
            type:String,
            required:true
        },
        from:{
            type:Date
        },
        to:{
            type:Date
        },
        details:{
            type:String
        }
    }
        
    ],
    social:{
        youtube:{
            type:String
        },
        facebook:{
            type:String
        },
        instagram:{
            type:String
        }
    },
    date:{
        type:Date,
        default:Date.now
    }

})

module.exports=Profile=mongoose.model("myProfile",ProfileSchema);