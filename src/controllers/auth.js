import bcrypt from 'bcrypt'
import { User, syncDatabase } from '../../database/sql.js';
import jwt from 'jsonwebtoken';


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