const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({      // SCHEMA DESIGN
    name :{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    productImage:{
        type:String,
        required:true
    }

})
const Product_list =mongoose.model("Product_list",userSchema);
module.exports=Product_list;