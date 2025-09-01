const express = require("express");
const router = express.Router();
const Subscriber = require("../models/Subscriber");

//@route POST /api/subscribers
//@desc handle a newsletter subscriber
//@access Public
router.post("/", async(req,res)=>{
    const {email} = req.body;
    if(!email){
        return res.status(400).json({message:"Email is required"});
    }

    try {
        //check if email already exists
        let subscriber = await Subscriber.findOne({email});
        if(subscriber){
            return res.status(400).json({message:"Email already subscribed"});
        }

        //create new subscriber
        subscriber = new Subscriber({email});
        await subscriber.save();

        res.status(201).json({message:"Subscribed successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server Error"});
    }
});

module.exports = router;

