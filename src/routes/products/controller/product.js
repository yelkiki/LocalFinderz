import { Op } from "sequelize";
import sequelize, { Brand, Product } from "../../../../database/sql.js"

export const displayAll = async (req,res,next)=>{
    try {
        let products = await Product.findAll({include: [
            {
              model: Brand,
              attributes: ['name']
            }
          ]});        
        
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

        let BRAND = await Brand.findOne({where:{name:brand}})
        if (!BRAND){
            next({message:"Can't find Brand",statusCode:500,data:[]})
        }
        let products = await Product.findAll({
            where: {
                brandId: BRAND.dataValues.id
            }
        })
        if (products.length == 0){
            next({message:"Empty Brand",statusCode:500,data:[]})
        }else{
            res.json({message:"Products Found",statusCode:200,data:products})
        }
    } catch (error) {
        console.log(error);
        next({message:"Error getting Brand's products",statusCode:500,data:error})
    }
}

export const getBrands = async (req,res,next)=>{
    try {
        let brands = await Brand.findAll();
        if (!brands){
            next({message:"No Available brands",statusCode:500,data:[]})
        }
        res.json({message:"Brands Found",statusCode:200,data:brands})
    } catch (error) {
        next({message:"Error getting brands",statusCode:500,data:error})
    }
}

export const getCategory = async (req, res, next) => {
    try {
      const { category } = req.body;
      let products = await Product.findAll({
        where: { category },
        include: [{ model: Brand, attributes: ['name'] }]
      });
  
      if (!products.length) {
        next({ message: "No Products available for this category", statusCode: 400, data: [] });
      } else {
        res.json({ message: "Successfully retrieved products", statusCode: 200, data: products });
      }
    } catch (error) {
      console.log(error);
      next({ message: "Error getting products in this category", statusCode: 400, data: error });
    }
  };
  



export const search = async (req, res, next) => {
    const { keyword } = req.body;
  
    try {
      const products = await Product.findAll({
        where: {
          name: {
            [Op.like]: `%${keyword}%`,
          },
        },include: [
            {
              model: Brand,
              attributes: ['name']
            }
        ]
      });
      if (!products.length){
        next({ message: "Cannot find with this keyword", statusCode: 400, data:[] });
      }
      res.json({ message: "found", statusCode: 200, data: products });
    } catch (error) {
      next({ message: "Invalid keyword", statusCode: 400, data:error });
    }
};

export const searchBrand = async (req, res, next) => {
    const { keyword } = req.body;
  
    try {
      const brands = await Brand.findAll({
        where: {
          name: {
            [Op.like]: `%${keyword}%`,
          },
        }
      });
      if (!brands.length){
        next({ message: "Cannot find Brand with this keyword", statusCode: 400, data:[] });
      }
      res.json({ message: "found", statusCode: 200, data: brands });
    } catch (error) {
      next({ message: "Invalid keyword", statusCode: 400, data:error });
    }
};


export const filterSex = async (req,res,next)=>{
    try {
        const {sex} = req.body;
    
        const query = 'Select name,image FROM products WHERE sex = ?';
        let result = await sequelize.query(query, {
            replacements: [sex],
            type: sequelize.QueryTypes.SELECT
        });
        if (!result.length){
            next({message:"Invalid or Empty Gender",statusCode:400,data:[]})
        }else{
            res.json({message:"Found",statusCode:200,data:result})
        }
    } catch (error) {
        console.log(error);
        next({message:"Error Getting Products For this sex",statusCode:400,data:error})
    }
};