import express, { Request, Response } from "express";
import { connectDB } from "./utils/connectDB";
import User from "./models/User";
import Website from "./models/Website";
import { userMiddleware, UserRequest } from "./middleware/user.middleware";
import Validator from "./models/Validator";
import bcrypt from "bcrypt";
import WebsiteTick from "./models/WebsiteTicks";
import jwt from "jsonwebtoken";
import cors from "cors";
import mongoose from "mongoose";

const app = express();



app.use(express.json());
connectDB();
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}))
import Stripe from 'stripe';
import resend from "./utils/resend";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil', // Make sure to specify the API version you are using
});

// Define Mongoose Schemas and Models

// Add User Endpoint

app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  console.log('Received webhook:');
 
});
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { amount } = req.body; // Destructure 'amount' from the request body

    if (!amount) {
     res.status(400).send({ error: 'Amount is required' });
     return
    }

    // Create a Checkout Session with line items
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Your Product Name', // Name of your product or service
            },
            unit_amount: amount, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',  // Mode of payment (single payment)
      success_url: 'http://localhost:3000/success', // Your success URL
      cancel_url: 'http://localhost:3000/cancel',   // Your cancel URL
    });

    // Send the Checkout Session ID to the frontend
    res.status(200).send({
      sessionId: session.id,
    });

  } catch (error:any) {
    console.error('Error creating checkout session:', error);
    res.status(500).send({
      error: error.message,
    });
  }
});
app.post("/api/addUser", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }
    const user = new User({
      name,
      email,
      password: bcrypt.hashSync(password, 10),
    });
    await user.save();
    res.status(201).json({ message: "User added successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error adding user", error });
  }
});


app.post("/api/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
   

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const user = await User.findOne({ email });
 
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    console.log("req.body", req.body);

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "2h",
    });
    console.log("Request reached here");
    const responded=await resend.emails.send({
      from: 'Decentralized Uptime Guardian <onboarding@tradenexusonline.com>',
      to: user.email,
      subject: 'hello world',
      html: '<p>it works!</p>',
    });
    console.log("Resend response",responded);

    // Set the cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2 * 60 * 60 * 1000, // 2 hours
    });

    console.log("Token generated:", token);
    res.status(200).json({ message: "Login successful", token: token });
  } catch (error: any) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Add Website Endpoint
app.post("/api/addWebsite", userMiddleware, async (req:UserRequest, res) => {
  try {
    console.log("req.body", req.body);
    const { url} = req.body;
    const userID=req.userID;
    console.log("userid", userID);
    const website = new Website({ url, userID });
    await website.save();
    const user=await User.findById(userID)
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return 
    }
    user.Websites.push(website._id as mongoose.Types.ObjectId);
    await user.save();
    res.status(201).json({ message: "Website added successfully", website });

  } catch (error) {
    console.error("error", error);
    res.status(500).json({ message: "Error adding website", error });
  }
});
app.post("/api/getWebsites", userMiddleware, async (req: UserRequest, res) => {
  try {
    const userID = req.userID;
    console.log("userid", userID);
    
    // Get all websites for the user and populate only the 20 latest ticks
    const websites = await Website.find({ userID }).populate({
      path: "Ticks",
      options: {
        sort: { createdAt: -1 }, // Sort ticks by createdAt in descending order (newest first)
        limit: 50 // Limit to 20 ticks per website
      }
    });
    
    console.log("websites", websites);
    res.status(200).json({ 
      message: "Websites fetched successfully", 
      websites: websites.map(website => ({
        ...website.toObject(),
        Ticks: website.Ticks // Already limited to 20 by the populate options
      }))
    });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ message: "Error fetching websites", error });
  }
});

app.post("/api/addValidator", async (req, res) => {
  try {
    const { publicKey, location } = req.body;
    console.log("req.body", req.body);
    const validator = new Validator({ publicKey, ip: req.ip, location });
    await validator.save();
    res
      .status(201)
      .json({ message: "Validator added successfully", validator });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ message: "Error adding validator", error });
  }
});
app.post("/api/addTick", async (req: any, res: any) => {
  try {
    console.log("req.body", req.body);
    const { websiteID, validatorID, status, latency, statusCode } = req.body;

    // 1. Validate inputs
    if (!validatorID || !status || !latency || !statusCode) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 2. Check website exists
    const website = await Website.findById(websiteID);
    if (!website) {
      return res.status(404).json({ error: "Website not found" });
    }

    // 3. Create and save the tick
    const tick = new WebsiteTick({
      validatorID,
      status,
      latency,
      statusCode,
      websiteID, // Store reference back to website
    });
    const savedTick: any = await tick.save();

    // 4. Add tick to website's Ticks array
    website.Ticks.push(savedTick._id);
    await website.save();

    // 5. Return the populated result
    const result = await Website.findById(websiteID)
      .populate("Ticks")
      .populate("userID");

    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = 4242;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
