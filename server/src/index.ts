import express from 'express';
import {connectDB} from './utils/connectDB';
import User from './models/User';
import Website from './models/Website';
import { userMiddleware } from './middleware/user.middleware';
import Validator from './models/Validator';
import WebsiteTick from './models/WebsiteTicks';

// Connect to MongoDB


const app = express();
app.use(express.json());
connectDB()
// Define Mongoose Schemas and Models

// Add User Endpoint
app.post('/api/addUser', async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = new User({ name, email });
        await user.save();
        res.status(201).json({ message: 'User added successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error adding user', error });
    }
});

// Add Website Endpoint
app.post('/api/addWebsite',userMiddleware, async (req, res) => {
    try {
        console.log("req.body",req.body);
        const { url, userID } = req.body;
        console.log("userid",userID);
        const website = new Website({ url, userID });
        await website.save();
        res.status(201).json({ message: 'Website added successfully', website });
    } catch (error) {
        console.error("error",error);   
        res.status(500).json({ message: 'Error adding website', error });
    }
});
app.post('/api/getWebsites', userMiddleware, async (req, res) => {
    try {
        const { userID } = req.body;
        console.log("userid",userID);
        const websites = await Website.find
            ({ userID });
        console.log("websites",websites);
        res.status(200).json({ message: 'Websites fetched successfully', websites });
    } catch (error) {
        console.error("error",error);   
        res.status(500).json({ message: 'Error fetching websites', error });
    }
});
app.get("/api/getWebsites",async (req,res)=>{

   try
   { 
         const websites = await Website.find({});
         console.log("websites",websites);
         res.status(200).json({ message: 'Websites fetched successfully', websites });

   }catch(error:any)
   {
         console.error("error",error);   
         res.status(500).json({ message: 'Error fetching websites', error });
   }

})
app.post('/api/addValidator', async (req, res) => {
    try {
        const { publicKey, location } = req.body;
        console.log("req.body",req.body);
        const validator = new Validator({ publicKey, ip:req.ip, location });
        await validator.save();
        res.status(201).json({ message: 'Validator added successfully', validator });
    } catch (error) {
        console.error("error",error);   
        res.status(500).json({ message: 'Error adding validator', error });
    }
});
app.post('/api/addTick', async(req:any, res:any) => {
  try {
    console.log("req.body",req.body);
    const { websiteID,validatorID, status, latency, statusCode } = req.body;

    // 1. Validate inputs
    if (!validatorID || !status || !latency || !statusCode) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 2. Check website exists
    const website = await Website.findById(websiteID);
    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }

    // 3. Create and save the tick
    const tick = new WebsiteTick({
      validatorID,
      status,
      latency,
      statusCode,
      websiteID // Store reference back to website
    });
    const savedTick :any= await tick.save();

    // 4. Add tick to website's Ticks array
    website.Ticks.push(savedTick._id);
    await website.save();

    // 5. Return the populated result
    const result = await Website.findById(websiteID)
      .populate('Ticks')
      .populate('userID');

    res.status(201).json(result);
    
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});