import { Brand, Product, User, syncDatabase } from "../../database/sql.js";

export const addBrand = async (req,res,next)=>{
    const {name,email,address,phone,logo} = req.body;
    try {
        let temp = await Brand.findAll({
            where:{
                name:name
            }
        })
        if (temp.length > 0){
            next({message:"Already Existing Brand", status_code:400,data:error})
        }else{
            if (logo){
                await Brand.create({name: name,email: email,address: address,phone: phone, logo: logo})
            }else{
                await Brand.create({name: name,email: email,address: address,phone: phone})
            }
            syncDatabase();
            res.json({message:"Brand Created!",status_code:200,data:[]});
        }
    } catch (error) {
        next({message:"Error creating Brand", status_code:400,data:error})
    }
}

export const removeBrand = async (req,res,next)=>{
    const {name} = req.body;
    try {
        await Brand.destroy({
            where:{
                name : name
            }
        })
        syncDatabase();
        res.json({message:"Brand Deleted!",status_code:200,data:[]});
    } catch (error) {
        next({message:"Error Deleting Brand",status_code:400,data:error});
    }
}



export const addProduct = async (req,res,next)=>{
    try {
        const {name,price,sex,brand,quantity,category,image} = req.body;
        if ((await Brand.findAll({where:{name:brand}})).length == 0){
            next({message:"Invalid Brand", status_code:400,data:[]})
        }
        await Product.create({name: name,price: price,sex: sex,brand: brand, category: category,image: image,quantity: quantity})
        syncDatabase();
        res.json({message:"Product Created!",status_code:200,data:[]});
    } catch (error) {
        next({message:"Error creating product", status_code:400,data:error})
    }
}

export const removeProduct = async (req,res,next)=>{
    const {id} = req.params;
    try {
        await Product.destroy({
            where:{
                id : id
            }
        })
        syncDatabase();
        res.json({message:"Product Deleted!",status_code:200,data:[]});
    } catch (error) {
        next({message:"Error Deleting Product",status_code:400,data:error});
    }
}


export const updateProduct = async (req,res,next)=>{
    const {id} = req.params;
    const {quantity} = req.body;
    try {
        const prod = await Product.findOne({where:{
            id:id
        }})
        await prod.update({quantity:quantity});
        await prod.save();
        syncDatabase();
        res.json({message:"Product Edited!",status_code:200,data:[]});
        
    } catch (error) {
        next({message:"Error Editing Product",status_code:400,data:error});
    }
}

export const deleteUser = async(req,res,next)=>{
    const {email} = req.body;
    try {
        if ((await User.findAll({where:{email:email}})).length > 0) {
            await User.destroy({
                where:{
                    email: email
                }
            })
            syncDatabase();
            res.json({message:"User Deleted Successfully",status_code:200,data:[]});
        }else{
            next({message:"Invalid Email",status_code:400,data:[]});
        }
    } catch (error) {
        console.log(error);
        next({message:"Error deleting user",status_code:400,data:error});
    }
}