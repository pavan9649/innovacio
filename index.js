const express= require('express');
const app =express();
const port=process.env.PORT || 3000;
const morgan=require("morgan")
const dotenv=require('dotenv');
const bcryptjs = require("bcryptjs");
const path =require("path")
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("tiny"));
const Users= require("./src/models/register");
dotenv.config({ path: './config.env'})
require("./src/db/conn")

app.get("/",async(req,res)=>{ // FIND ALL USERS
    const userList = await Users.find();

    if (!userList) {
      res.status(500).json({ success: false });
    }
    res.send(userList);
})



app.get(`/:id`, async (req, res) => {         // FIND PARTICULAR USER
    const userList = await Users.findById(req.params.id);
  
    if (!userList) {
      res.status(500).json({ success: false });
    }
    res.send(userList);
  });
  

 
app.post("/", async(req,res)=>{                 // CREATED NEW USER
    const salt = await bcryptjs.genSalt(12);
    const password= req.body.password;

    // hash the password
    const hash = await bcryptjs.hash(password, salt);
    let user = new Users({
        name: req.body.name,
       username:req.body.username,
       password:hash        
      });
      user = await user.save();
    
      if (!user) return res.status(400).send("the user cannot be created!");
    
      res.send(user);

})



app.put("/:id", async (req, res) => {         // UPDATED USER 
    const user = await Users.findByIdAndUpdate(
      req.params.id,
      {
        name:req.body.name,
        username:req.body.username
      },
      { new: true }
    );
  
    if (!user) return res.status(400).send("the user cannot be updated");
  
    res.send(user);
  });


 
  app.delete("/:id", (req, res) => {              // DELETE USER
    Users.findByIdAndRemove(req.params.id)
      .then((user) => {
        if (user) {
          return res
            .status(200)
            .json({ success: true, message: "the user deleted" });
        } else {
          return res
            .status(404)
            .json({ success: false, message: "the user not found" });
        }
      })
      .catch((err) => {
        return res.status(400).json({ success: false, error: err });
      });
  });



app.listen(port,()=>{
    console.log(`server is running at port no ${port}`);
})