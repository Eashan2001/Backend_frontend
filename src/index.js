import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { registerUser } from "./controllers/user.controller.js"; // Import your controller

dotenv.config({
    path: './.env'
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Connect to MongoDB
connectDB()
    .then(() => {
        // Define user registration route
        app.post("/api/v1/users/register", registerUser);

        // Start the server
        app.listen(PORT, () => {
            console.log(`⚙️ Server is running at port : ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    });
