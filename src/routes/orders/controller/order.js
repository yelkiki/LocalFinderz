import sequelize, { Cart, CartItem, Order, OrderDetail, Product } from "../../../../database/sql.js"




export const placeOrder = async (req,res,next)=>{
    try {
        const cart = await Cart.findOne({where:{userId: req.user.id}});
        if (!cart || cart.total === 0){
            next({message:"Your cart is empty",status_code:400,data:error})
        }else{
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

            const currentDate = new Date();
            let order = await Order.create({userId:req.user.id,total:total,date:currentDate});



            const query = `
            INSERT INTO orderdetails (orderId, productId, quantity)
            SELECT o.id AS orderId, ci.productId, ci.quantity
            FROM carts c
            JOIN cartitems ci ON c.id = ci.cartId
            JOIN orders o ON c.userId = o.userId
            WHERE c.id = ? AND o.id = ?;
            `;

            await sequelize.query(query, {
                replacements: [cart.id, order.id],
                type: sequelize.QueryTypes.INSERT
            });
            
            await Cart.destroy({
                where: {
                  userId: req.user.id,
                }
            });
            await CartItem.destroy({
                where:{
                    cartId:cartId
                }
            })

            res.json({message:"Done",status_code:200,data:[]})
        }
    } catch (error) {
        console.log(error);
        next({message:"Could not place order",status_code:400,data:error})
    }
}


export const orderDetails = async (req,res,next)=>{
    const {orderId} = req.body;
    try {
        const query = `
        SELECT p.id, p.name, p.image, od.quantity, p.price * od.quantity AS cost, o.total
        FROM OrderDetails AS od
        INNER JOIN Products AS p ON od.productId = p.id
        INNER JOIN orders AS o ON od.orderId = o.id
        WHERE od.orderId = :orderId
        `;
        const items = await sequelize.query(query, {
            replacements: { orderId },
            type: sequelize.QueryTypes.SELECT,
        });

        res.json({message:"Found",status_code:200,data:items})
    } catch (error) {
        console.log(error);
        next({message:"Could not view order details",status_code:400,data:error})
    }
}