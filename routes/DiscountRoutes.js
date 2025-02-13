const express = require("express");
const Discount = require('../models/Discount');
const router = express.Router();

//getall
router.get('/', async (req, res) => {
  const data = await Discount.find();
  res.send(data);
});

//getById
router.get('/:id', async (req, res) => {
  try {
    const data = await Discount.findById(req.params.id);
    if (!data) {
      return res.send({ message: "Discount not found" });
    }
    res.send(data);
  }
  catch (error) {
    res.send(error);
  }
});

//insertDiscount
router.post("/", async (req, res) => {
  try {
    const { discount_value, discount_startDate, discount_endDate } = req.body;
    if(!discount_value || !discount_startDate || !discount_endDate){
        res.send({message:"All the fields are required..."})
    }
    const data = await Discount.create(req.body);
    res.send(data);
  }
  catch (error) {
    res.send(error);
  }
});

//updateDiscount
router.patch('/:id', async (req, res) => {
  try {
    const data = await Discount.findByIdAndUpdate(req.params.id, req.body);
    if (!data) {
      return res.send({ message: "Discount not found" });
    }
    res.send(data);
  }
  catch (error) {
    res.send(error);
  }
});

//DeleteDiscount
router.delete('/:id',async(req,res)=>{
  try {
    const data = await Discount.findByIdAndDelete(req.params.id)
    if (!data) {
      return res.send({ message: "Discount not found" });
    }
    res.send({message:"Discount Deleted Successfully",data:data});
  } 
  catch (error) {
    res.send(error);
  }
})

module.exports = router;