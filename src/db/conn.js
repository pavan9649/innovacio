const mongoose=require('mongoose');  // DATABASE CONNECTION
const DB=process.env.DATABASE;
mongoose.connect(DB,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log(`connection succesful`);
}).catch((e)=>{
    console.log(e);
})