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
app.use('/uploads',express.static('uploads'));
const list= require("./src/models/list");
dotenv.config({ path: './config.env'})
require("./src/db/conn")
const multer =require("multer");
const { listeners } = require('process');
//const upload= multer({dest: 'uploads/'})
const storage= multer.diskStorage({
  destination: function(req,file,cb){

    cb(null,"./uploads/")
  },
  filename:function(req,file,cb){
    const filename=(String)(file.originalname)
    cb(null,  filename)
  }
}) 
const upload=multer({storage:storage});

app.get("/",async(req,res)=>{ // FIND ALL USERS
  const productList = await list.find();

  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
})

app.get(`/:id`, async (req, res) => {         // FIND PARTICULAR USER
  const productList = await list.findById(req.params.id);

  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});

app.post("/",upload.single('productImage') ,async(req,res)=>{                 // CREATED NEW USER
  
    let item = new list({
        name: req.body.name,
       description:req.body.description,
       productImage:req.file.path    
      });
    item = await item.save();
    //console.log(user);
      if (!item) return res.status(400).send("the product cannot be created!");
    
      res.send(item);

})

app.put("/:id", async (req, res) => {         // UPDATED USER 
  const item = await list.findByIdAndUpdate(
    req.params.id,
    {
      name:req.body.name,
      description:req.body.description,
      productImage:req.file.path    
    },
    { new: true }
  );

  if (!item) return res.status(400).send("the product cannot be updated");

  res.send(item);
});

app.delete("/:id", (req, res) => {              // DELETE USER
  listeners.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .json({ success: true, message: "the product deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "the product not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});
app.listen(port,()=>{
    console.log(`server is running at port no ${port}`);
})