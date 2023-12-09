import { Brand, Product } from "../../../../database/sql.js"

export const displayAll = async (req,res,next)=>{
    try {
        let products = await Product.findAll();
        res.json({message:"Products Displayed",statusCode:200,data:products})
    } catch (error) {
        next({message:"Can't Display Products",statusCode:500,data:error})
    }
}

export const displayProduct = async (req,res,next)=>{
    try {
        const {id} = req.body
        
        let product = await Product.findOne({where:{
            id: id
        }})
        if (!product){
            next({message:"Invalid ID",statusCode:500,data:[]})
        }
        res.json({message:"Products Found",statusCode:200,data:product})
    } catch (error) {
        console.log(error);
        next({message:"Can't Display Product",statusCode:500,data:error})
    }
}

export const getBrandsProducts = async (req,res,next)=>{
    try {
        const {brand} = req.body
        let products = await Product.findAll({
            where: brand=brand 
        })
        res.json({message:"Products Found",statusCode:200,data:products.dataValues})
    } catch (error) {
        next({message:"Error getting Brand's products",statusCode:500,data:error})
    }
}

export const getBrands = async (req,res,next)=>{
    try {
        let brands = await Brand.findAll();
        res.json({message:"Brands Found",statusCode:200,data:brands.dataValues})
    } catch (error) {
        next({message:"Error getting brands",statusCode:500,data:error})
    }
}