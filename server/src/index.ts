import express, { Request, Response } from 'express';
import {connectDB} from './utils/connectDB';
import User from './models/User';
import Website from './models/Website';
import { userMiddleware, UserRequest } from './middleware/user.middleware';
import Validator from './models/Validator';
import bcrypt from 'bcrypt';
import WebsiteTick from './models/WebsiteTicks';
import jwt from 'jsonwebtoken';



const app = express();
app.use(express.json());
connectDB()
// Define Mongoose Schemas and Models

// Add User Endpoint
app.post('/api/addUser', async (req, res) => {
    try {
        const { name, email,password } = req.body;
        const user = new User({ name, email,password:bcrypt.hashSync(password, 10) });
        await user.save();
        res.status(201).json({ message: 'User added successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error adding user', error });
    }
});
app.post('/api/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '2h' }
    );

    // Set the cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict',
      maxAge: 2 * 60 * 60 * 1000 // 2 hours
    });

    res.status(200).json({ message: 'Login successful' });
  } catch (error: any) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
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
app.post('/api/getWebsites', userMiddleware, async (req:UserRequest, res) => {
    try {
        const userID = req.userID ;
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