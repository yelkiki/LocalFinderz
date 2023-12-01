import jwt from "jsonwebtoken";
import sequelize, { User } from "../../database/sql.js";


export const authorization = ()=>{
    return (req,res,next)=>{
        try {
            if (req.user.role != 2){
                res.status(401).json({message: "Not Authorized User",statusCode: 401});
                return;
            }
            next();
        } catch (error) {
            res.json({message: "Error Authentication",statusCode:401})
        }
    }
}

export const authentication=()=>{
    return async (req, res, next)=>{
        try {
            
            const {authorization} = req.headers;
            if (authorization === undefined || !authorization.startsWith("LFinders")) {
                return res.json({message: "Not Authenticated User",statusCode: 401})
            }
            const token = authorization.split("LFinders")[1]
            const payLoad = jwt.verify(token,"password")
            const {id} = payLoad
            let result = await User.findOne({where:{
                id: id
            }});            
            req.user = result.dataValues;
            req.user.id = id;
            next();
            
            
        } catch (error) {
            console.log(error);
            return res.json({message: "Error Authentication", statusCode:401})
        }
    }
}