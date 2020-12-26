const mongoose=require("mongoose");

const userSchema = new mongoose.Schema({
    email : {type: String, required: true, unique:true},
    password: {type: String, required: true, minlength: 5},
    displayName: {type: String},
    role : {type: String, default: "user", enum: ["user", "admin"]},
    block : { type : Boolean, default:false,required:true }

    
    


});
module.exports= mongoose.model("User", userSchema);