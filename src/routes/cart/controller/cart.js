import sequelize, { Cart, CartItem, Product } from "../../../../database/sql.js";


//// e3mel function bet calculate total w bet7oto
export const displayCart = async (req,res,next)=>{
    try {
        let cart = await Cart.findOne({where:{userId: req.user.id}})
        if (!cart){
            cart = await Cart.create({userId:req.user.id})    
        }             
        const cartId = cart.id
        const sqlQuery = `
        SELECT Products.name,Products.price,CartItems.quantity
        FROM CartItems
        JOIN Products ON CartItems.productId = Products.id
        WHERE CartItems.cartId = :cartId
        `;
        const items = await sequelize.query(sqlQuery, {
            replacements: { cartId },
            type: sequelize.QueryTypes.SELECT,
        });
        let total = 0;
        for (const item of items){
            total+= item.price*item.quantity
        }
        res.json({message:"Found",status_code:200,data:[items,total]});
                
        // const items = await CartItem.findAll({
        //     where:{
        //         cartId:cart.id
        //     },
        //     include: [{ model: Product }]
        // })
    } catch (error) {
        console.log(error);
        next({message:"error displaying cart",status_code:401,data:error})
    }
}

export const add2cart = async (req,res,next)=>{
    const {id} = req.params;
    try {
        
        const cart = await Cart.findOne({where:{userId: req.user.id}})
        if (!cart){
            cart = await Cart.create({userId:req.user.id})    
        }
        if(await CartItem.findOne({where:{cartId:cart.id,productId:id}})){
            await CartItem.increment(
                { quantity: 1 },
                {
                  where: {
                    cartId: cart.id,
                    productId: id,
                  }
                }
            );
        }else{
            await CartItem.create({cartId:cart.id,productId:id})
        }
        res.json({message:"Added!",statusCode:200,data:[]})
    } catch (error) {
        console.log(error);
        next({message:"error adding to cart",statusCode:401});
    }
}

export const removeFromCart = async (req,res,next)=>{
    try {
        const {id} = req.params;
        const cart = await Cart.findOne({where:{userId: req.user.id}})
        const cartItem = await CartItem.findOne({
            where: { cartId:cart.id, productId:id }
        });
        if (cartItem){
            await CartItem.destroy({
                where: {
                    cartId: cart.id,
                    productId: id,
                }
            });
            res.json({message:"Item Removed",status_code:200,data:[]});
        }else{
            next({message:"Product is not in your cart anymore",statusCode:400,data:[]})
        }
    } catch (error) {
        next({message:"Could not remove item from cart",status_code:400,data:[]});
    }
}

// Increment Product
export const incQuant = async (req,res,next)=>{
    try {
        const {id} = req.params
        const cart = await Cart.findOne({where:{userId: req.user.id}})
        const cartItem = await CartItem.findOne({
            where: { cartId:cart.id, productId:id }
        });
        if (cartItem){
            await CartItem.increment(
                { quantity: 1 },
                {
                  where: {
                    cartId: cart.id,
                    productId: id,
                  }
                }
            );
            res.json({message:"Added!",statusCode:200,data:[]})
        }else{
            next({message:"This Product is not in your cart anymore",statusCode:400,data:[]})
        }
    } catch (error) {
        next({message:"Error Occurred!",statusCode:400,data:[]})
    }
}

// Decrement Product
export const decQuant = async (req,res,next)=>{
    try {
        const {id} = req.params
        const cart = await Cart.findOne({where:{userId: req.user.id}})
        const cartItem = await CartItem.findOne({
            where: { cartId:cart.id, productId:id }
        });
          
          if (cartItem && cartItem.quantity === 1) {
            await CartItem.destroy({
                where: { cartId:cart.id, productId:id }
            });
          } else if (cartItem && cartItem.quantity > 1) {
            await CartItem.decrement(
              { quantity: 1 },
              {
                where: { cartId:cart.id, productId:id }
              }
            );
          }else{
            next({message:"Product is not in your cart anymore",statusCode:400,data:[]})
          }

        res.json({message:"Removed!",statusCode:200,data:[]})
    } catch (error) {
        next({message:"Error Occurred!",statusCode:400,data:[]})
    }
}