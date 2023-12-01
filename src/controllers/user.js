export const displayInfo = (req,res,next)=>{
    res.json({message:"Successful",statusCode:200,data:req.user})
}