import auth from './../models/auth.models.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

// nodemailer config
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Generate Access Token
const generateAccessToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.SECRET_KEY, { expiresIn: '15m' });  // expires in 15 minutes
};

// Generate Refresh Token
const generateRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.REFRESH_SECRET_KEY, { expiresIn: '7d' });  // expires in 7 days
};

// Register User
const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        // Check if the user already exists
        const userExists = await auth.findOne({ email });
        if (userExists) return res.status(400).json({ message: "Email already exists" });


        const newUser = new auth({ name, email, password, role });
        await newUser.save();
        //mohammedshahzaib046@gmail.com
        const info = await transporter.sendMail({
            from: `"Welcome to Our Store 🛒" <${process.env.EMAIL_USER}>`,
            to: `${email}`, // User's email
            subject: "🎉 Welcome to Our Online Store! 🎉", // Subject of the email
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <div style="text-align: center;">🛒</div>
                    <h1 style="color: #333; text-align: center; font-size: 24px; margin-bottom: 20px;">Welcome to Our Online Store!</h1>
                    <p style="color: #555; text-align: center; font-size: 16px; line-height: 1.6;">
                        Hi <strong>${name}</strong>,
                    </p>
                    <p style="color: #555; text-align: center; font-size: 16px; line-height: 1.6;">
                        Thank you for joining us! We’re delighted to have you as part of our community. Explore a wide range of products designed just for you.
                    </p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a 
                            href="https://github.com/AbdulMoiz-Ali" 
                            style="background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">
                            Start Shopping Now
                        </a>
                    </div>
                    <p style="color: #555; text-align: center; font-size: 16px; line-height: 1.6;">
                        If you have any questions or need assistance, feel free to reach out to our support team.
                    </p>
                    <p style="color: #555; text-align: center; font-size: 16px; line-height: 1.6;">
                        Happy shopping!<br/>
                        <strong>The Store Team</strong>
                    </p>
                    <footer style="text-align: center; font-size: 12px; color: #999; margin-top: 20px;">
                        © ${new Date().getFullYear()} Our Online Store. All rights reserved.
                    </footer>
                </div>
            `,
        });



        console.log("Message sent: %s", info.messageId);
        res.status(201).json({ message: "User created successfully", data: { name, email } });
    } catch (error) {
        console.error("Error in register:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Login User
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await auth.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email or password is incorrect" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Email or password is incorrect" });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Store refreshToken in cookies
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Send accessToken to client
        res.status(200).json({
            message: "Login successful",
            accessToken,
            user: {
                name: user.name,
                email: user.email,
            }
        });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// Logout Route - Clear Refresh Token Cookie
const logout = (req, res) => {
    res.clearCookie("refreshToken");  // Clear the refreshToken cookie
    res.status(200).json({ message: "Logged out successfully" });
};

// pagination
// const getAllUser = async (req, res) => {
//     const page = req.query.page || 1;
//     const limit = req.query.limit || 1;

//     const skip = (page - 1) * limit;

//     const users = await auth.find({}).skip(skip).limit(limit);
//     res.json({ data: users, length: users.length });
// };




export { register, login, generateAccessToken, generateRefreshToken, logout };
