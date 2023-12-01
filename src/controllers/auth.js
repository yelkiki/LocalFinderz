import bcrypt from 'bcrypt'
import { User, syncDatabase } from '../../database/sql.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../services/nodeMailer.js';
import crypto from 'crypto'
import { configDotenv } from "dotenv";
import { error } from 'console';
configDotenv("../../config/.env")




export const Login = async (req,res,next)=>{
    const {email,password} = req.body;
    const result = await User.findAll({
        where:{
            email: email
        }
    })
    if (result.length > 0){
        const resultt = await bcrypt.compare(password,result[0].dataValues.password);
        if (resultt){
            const token = jwt.sign({id: result[0].id, isLoggedIn: true}, "password", {expiresIn:"1h"})
            res.json({message: "Signed in Successfully",statusCode:200, token});
            return;
        }else{
            next({message:"Wrong Password",statusCode:406});
        }
    }else{
        next({message:"Email not found",statusCode:406});
    }
}


export const Register = async (req,res,next)=>{
    const {firstname,lastname,email,password,phone,address} = req.body;
    let temp = await User.findAll({
        where:{
            email:email
        }
    })
    if (temp.length > 0){
        res.json({message:"This email is already taken",statusCode:401,data:[]});
        return;
    }
    try {
        const hashed = bcrypt.hashSync(password,parseInt(process.env.SALTED));
        await User.create({firstname:firstname,lastname:lastname,address:address,email:email,password:hashed,phone:phone,role:1});  
        res.json({message:"User created successfully",statusCode:200,data:[]});
        syncDatabase();
        return;
    } catch (error) {
        console.log(error);
        next({message:"Error creating your account",statusCode:500,error});
    }
}

export const sendmail = async (req,res,next)=>{
    const {email} = req.body
    const token = crypto.randomBytes(20).toString('hex');
    try {
        // Send reset password link via email
        const resetEmailHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <title>Password Reset</title>
        </head>
        <body style="font-family: Arial, sans-serif;">

        <h2>Password Reset</h2>

        <p>Hello,</p>

        <p>We received a request to reset your password. To proceed with the password reset, please click the link below:</p>

        <a href="http://localhost:3000/auth/reset/${token}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>

        <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>

        <p>Thank you,</p>
        <p>LocalFinderz</p>

        </body>
        </html>
        `;//////////////////////////////////////////////////////////////////// edit link to add endpoint to reset password
        const emailResult = await sendEmail(email, resetEmailHtml);
        if (emailResult.accepted.length){
            const user = await User.findOne({ where: { email } });
            if (!user) {
              return res.status(404).send('User not found');
            }
        
            // Update the user's row in the database with the token
            await user.update({
              resetToken: token,
            });        
            res.json({ message: 'Email sent', statusCode: 200, data: [] });
        }
      } catch (error) {
        console.log(error);
        next({ message: 'Error sending email', statusCode: 400, data: error });
      }
}


export const ResetPassword = async (req,res,next)=>{
    const { token } = req.params;
    const { newPassword } = req.body;
    try {
        const user = await User.findOne({
          where: {
            resetToken: token,
          },
        });
        if (!user) {
          next({message:'Invalid token',statusCode:400,data:[]});
        }
        // Update user's password and clear/reset the resetToken field
        const hashed = bcrypt.hashSync(newPassword,parseInt(process.env.SALTED));
        await user.update({
        password: hashed,
          resetToken: null
        });    
        res.json({message:'Password reset successful',statusCode:200,data:[]});
      } catch (error) {
        next({message:'Error resetting password',statusCode:500,data:error});
      }

}