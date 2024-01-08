import { Order } from "../../../../database/sql.js"

export const displayInfo = (req,res,next)=>{
    res.json({message:"Successful",statusCode:200,data:req.user})
}

export const orderHistory = async (req,res,next)=>{
    const orders = await Order.findAll({where:{userId:req.user.id,status:true}})
    const simplifiedOrders = orders.map(({ id, date, total }) => ({ id, date, total }));
    res.json({message:"Successful",statusCode:200,data:simplifiedOrders})
}