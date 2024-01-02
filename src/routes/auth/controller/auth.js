import bcrypt from 'bcrypt'
import { sequelize } from '../../../../database/sql.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../../../services/nodeMailer.js';
import crypto from 'crypto'
import { configDotenv } from "dotenv";
configDotenv("../../config/.env")


export const Login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const query = `SELECT * FROM users WHERE email = ?`;
    const result = await sequelize.query(query, {
      replacements: [email],
      type: sequelize.QueryTypes.SELECT
    });

    if (result.length > 0) {
      
      const isPasswordCorrect = await bcrypt.compare(password,result[0].password);
      if (isPasswordCorrect) {
        const token = jwt.sign({id: result[0].id, isLoggedIn: true}, "password", {expiresIn:"1h"})
        res.json({message: "Signed in Successfully",statusCode:200, token,role:result[0].role});
      } else {
        next({ message: "Wrong Password", statusCode: 406 });
      }
    } else {
      next({ message: "Email not found", statusCode: 406 });
    }
  } catch (error) {
    console.log(error);
    next({ message: "Error during login", statusCode: 500, data: error });
  }
};

export const Register = async (req, res, next) => {
  const { firstname, lastname, email, password, phone, address } = req.body;
  try {
    const checkExistingEmailQuery = `SELECT * FROM users WHERE email = ?`;
    const existingUser = await sequelize.query(checkExistingEmailQuery, {
      replacements: [email],
      type: sequelize.QueryTypes.SELECT
    });

    if (existingUser.length > 0) {
      next({ message: "This email is already taken", statusCode: 401, data: [] });
    } else {
      const hashedPassword = bcrypt.hashSync(password,parseInt(process.env.SALTED));

      const createUserQuery = `INSERT INTO users (firstname, lastname, address, email, password, phone, role) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      await sequelize.query(createUserQuery, {
        replacements: [firstname, lastname, address, email, hashedPassword, phone, 1]
      });

      res.json({ message: "User created successfully", statusCode: 200, data: [] });
    }
  } catch (error) {
    console.log(error);
    next({ message: "Error creating your account", statusCode: 500, data: error });
  }
};


export const sendmail = async (req,res,next)=>{
    const {email} = req.body
    const token = crypto.randomBytes(3).toString('hex');
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

        <p>We received a request to reset your password.</p>

        <p>Your password reset code is: <strong><h3>${token}</h3></strong></p>
       

        <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>

        <p>Thank you,</p>
        <p>LocalFinderz</p>

        </body>
        </html>
        `;
        const emailResult = await sendEmail(email, resetEmailHtml);
        if (emailResult.accepted.length){
            const user = await sequelize.query('SELECT * FROM users WHERE email = ?', {
              replacements: [email],
              type: sequelize.QueryTypes.SELECT
            });

        
            if (!user) {
              next({ message: "This email isn't Registered", statusCode: 200, data: [] });
              return;
            }
        
            // Update the user's row in the database with the token
            await sequelize.query('UPDATE users SET resetToken = ? WHERE email = ?', {
              replacements: [token, email],
              type: sequelize.QueryTypes.UPDATE
            });
        
            res.json({ message: 'Email sent', statusCode: 200, data: [] });
        }
      } catch (error) {
        console.log(error);
        next({ message: 'Error sending email', statusCode: 400, data: error });
      }
}


export const VerifyToken = async (req,res,next)=>{
  const {token} = req.body;
  try {
    const user = await sequelize.query('SELECT * FROM users WHERE resetToken = ?', {
      replacements: [token],
      type: sequelize.QueryTypes.SELECT
    });

    if (!user) {
      next({ message: 'Invalid Code', statusCode: 400, data: [] });
    }
    res.json({ message: 'Valid', statusCode: 200, data: user[0].id });
  } catch (error) {
    next({message:'Could not validate Code',statusCode:400,data:[]});
  }
}


export const ResetPassword = async (req,res,next)=>{
    
    const { id,newPassword } = req.body;
    try {
        // Update user's password and clear/reset the resetToken field
      const hashed = bcrypt.hashSync(newPassword,parseInt(process.env.SALTED));

      const updateQuery = 'UPDATE users SET password = ?, resetToken = null WHERE id = ?';
      await sequelize.query(updateQuery, {
      replacements: [hashed, id],
      type: sequelize.QueryTypes.UPDATE
      });

      res.json({ message: 'Password reset successful', statusCode: 200, data: [] });
      } catch (error) {
        next({message:'Error resetting password',statusCode:500,data:error});
      }

}