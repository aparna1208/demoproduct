var express=require('express');
var cors=require('cors');
const mongoose=require('mongoose');
const multer= require("multer");
//express object
var api=express()
//cors object
api.use(cors())
api.use(express.urlencoded({extended: true}))
api.use(express.static("upload"))
//json
api.use(express.json())
api.use(express.urlencoded({extended:true}))

//multer
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{cb(null,'upload/')},
    filename:(req,file,cb)=>{cb(null,file.originalname)} 
});
const upload = multer({storage:storage})
//****** person registration*****************

//table creation
const clientStructure=new mongoose.Schema({fname:String,email:String,password:String,fileurl:String})
//model
const clientModel = new mongoose.model('client register',clientStructure)

  api.post('/clientform', upload.single('file'), (req, res) => {
    var fname = req.body.fname;
    var email = req.body.email;
    var password = req.body.password;
    const url = req.file.filename;
    const obj = new clientModel({fname:fname,email:email,password:password,fileurl:url});
    obj.save().then(() => {
      res.send({ "msg": "send successfully" });
    }).catch((error) => {
      res.status(500).send({ "error": "An error occurred while saving the object" });
    });
  });
  //****************category register************/
const categoryStructure = new mongoose.Schema({ category: String });
const categoryModel = new mongoose.model('category register', categoryStructure);

api.post('/categoryform', upload.single('file'), async (req, res) => {
  var category = req.body.category;

  // Check if category is a non-empty string
  if (typeof category !== 'string' || category.trim().length === 0) {
    return res.status(400).send({ "error": "Invalid category" });
  }

  // Convert the category to uppercase before saving
  category = category.trim().toUpperCase();

  try {
    // Check if the category already exists in the database
    const existingCategory = await categoryModel.findOne({ category: category });

    if (existingCategory) {
      // Category already exists, send an error response
      return res.send({ "msg": "Category already exists" });
    }

    // Category doesn't exist, save it to the database
    const obj = new categoryModel({ category: category });
    await obj.save();

    res.send({ "msg": "category added" });
  } catch (error) {
    res.status(500).send({ "error": "An error occurred while saving category" });
  }
});

// Route to fetch existing categories from the database
api.get('/getcategories', async (req, res) => {
  try {
    const existingCategories = await categoryModel.find({}, 'category'); // Fetch only the 'category' field
    const categories = existingCategories.map((category) => category.category);
    res.send({ categories });
  } catch (error) {
    res.status(500).send({ "error": "An error occurred while fetching categories" });
  }
});


  //
//*************************product register######################
  //table creation
const productStructure=new mongoose.Schema({pname:String,category:String,price:Number,stock:Number,fileurl:String})
//model
const productModel = new mongoose.model('product register',productStructure)

  api.post('/productform', upload.single('file'), (req, res) => {
    var pname = req.body.pname;
    var category = req.body.category;
    var price = req.body.price;
    var stock = req.body.stock;
    const url = req.file.filename;
    const obj = new productModel({pname:pname,category:category,price:price,stock:stock,fileurl:url});
    obj.save().then(() => {
      res.send({ "msg": "product added" });
    }).catch((error) => {
      res.status(500).send({ "error": "An error occurred while saving the object" });
    });
  });
  //################view product....................
  api.use(express.static("upload"))
  api.get('/viewproduct',async(request,response)=>{
    var data=await productModel.find()
    response.send ({'result':data})
})

//Delete
api.delete('/deleteproduct/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    // Find the product by ID and remove it
    await productModel.findByIdAndRemove(productId);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});



//mongoose connection and database creation
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/demoDB');
  console.log("Database Connected")
}
//server creation 
api.listen(9000,()=>{
    console.log("Server running http://localhost:9000")
})