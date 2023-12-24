import jwt from "jsonwebtoken";
import sequelize, { User } from "../../database/sql.js";


export const authorization = ()=>{
    return (req,res,next)=>{
        try {
            if (req.user.role != 2){
                console.log(req.user.role);
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
            const {id} = payLoad;
            const query = 'SELECT * FROM users WHERE id = ?';
            const result = await sequelize.query(query, {
                replacements: [id],
                type: sequelize.QueryTypes.SELECT
            });
            req.user = result[0];
            next();
            
            
        } catch (error) {
            console.log(error);
            return res.json({message: "Error Authentication", statusCode:401})
        }
    }
}