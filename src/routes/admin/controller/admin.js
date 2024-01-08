import sequelize, { Brand, Product, User, syncDatabase } from "../../../../database/sql.js";

export const addBrand = async (req,res,next)=>{
    const {name,email,address,phone,logo} = req.body;
    try {
        let temp = await Brand.findAll({
            where:{
                name:name
            }
        })
        if (temp.length > 0){
            next({message:"Already Existing Brand", statusCode:400,data:error})
        }else{
            if (logo){
                await Brand.create({name: name,email: email,address: address,phone: phone, logo: logo})
            }else{
                await Brand.create({name: name,email: email,address: address,phone: phone})
            }
            syncDatabase();
            res.json({message:"Brand Created!",statusCode:200,data:[]});
        }
    } catch (error) {
        next({message:"Error creating Brand", statusCode:400,data:error})
    }
}

export const removeBrand = async (req,res,next)=>{
    const {name} = req.body;
    try {
        let brand = await Brand.findAll({where:{name:name}});
        if (brand.length > 0){
            const deleteQuery = 'DELETE FROM brands WHERE name = ?';
            await sequelize.query(deleteQuery, {
            replacements: [name],
            type: sequelize.QueryTypes.DELETE
            });
    
            res.json({ message: 'Brand Deleted!', statusCode: 200, data: [] });
        }else{
            next({message:"Invalid Brand Name",statusCode:400,data:[]})
        }
    } catch (error) {
        console.log(error);
        next({message:"Error Deleting Brand",statusCode:400,data:error});
    }
}



export const addProduct = async (req,res,next)=>{
    try {
        const {name,price,sex,brand,quantity,category,image} = req.body;
        
        let BRAND = await Brand.findOne({where:{name:brand}})
        

        if (!BRAND){
            next({message:"Invalid Brand", statusCode:400,data:[]})            
        }else{
            await Product.create({name,price,sex,quantity,image,category,brandId:BRAND.dataValues.id})
            syncDatabase();
            res.json({message:"Product Created!",statusCode:200,data:[]});
        }
    } catch (error) {
        console.log(error);
        next({message:"Error creating product", statusCode:400,data:error})
    }
}

export const removeProduct = async (req,res,next)=>{
    const {id} = req.params;
    try {

        let product = await Product.findAll({where:{id:id}})
        if (product.length > 0){
            await Product.destroy({
                where:{
                    id : id
                }
            })
            syncDatabase();
            res.json({message:"Product Deleted!",statusCode:200,data:[]});
        }else{
            next({message:"Invalid ID",statusCode:400,data:[]})
        }
    } catch (error) {
        next({message:"Error Deleting Product",statusCode:400,data:error});
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
        res.json({message:"Product Edited!",statusCode:200,data:[]});
        
    } catch (error) {
        next({message:"Error Editing Product",statusCode:400,data:error});
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
            res.json({message:"User Deleted Successfully",statusCode:200,data:[]});
        }else{
            next({message:"Invalid Email",statusCode:400,data:[]});
        }
    } catch (error) {
        console.log(error);
        next({message:"Error deleting user",statusCode:400,data:error});
    }
}