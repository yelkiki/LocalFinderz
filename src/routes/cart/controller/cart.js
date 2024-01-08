import sequelize, { Order, OrderDetail, Product } from "../../../../database/sql.js";


//// e3mel function bet calculate total w bet7oto
export const displayCart = async (req,res,next)=>{
    try {
        let cart = await Order.findOne({
            where:{
                userId: req.user.id,
                status: false
            }
        })
        if (!cart){
            const currentDate = new Date();
            cart = await Order.create({
                userId: req.user.id,
                status: false,
                date: currentDate,
                total: 0
            })   
        }             
        const userid = req.user.id
        const sqlQuery = `
        SELECT Products.name,Products.price,OrderDetails.quantity
        FROM OrderDetails
        JOIN Products ON OrderDetails.productId = Products.id
        JOIN Orders ON Orders.id = OrderDetails.orderId
        WHERE Orders.userId = :userid AND Orders.status = false
        `;
        const items = await sequelize.query(sqlQuery, {
            replacements: { userid },
            type: sequelize.QueryTypes.SELECT,
        });
        res.json({message:"Found",statusCode:200,data:[items,cart.dataValues.total]});
    } catch (error) {
        console.log(error);
        next({message:"error displaying cart",statusCode:401,data:error})
    }
}

export const add2cart = async (req,res,next)=>{
    const {id} = req.params;
    try {
        
        let cart = await Order.findOne({
            where:{
                userId: req.user.id,
                status: false
            }
        })
        if (!cart){
            const currentDate = new Date();
            cart = await Order.create({
                userId: req.user.id,
                status: false,
                date: currentDate,
                total: 0
            })
        }
        if(await OrderDetail.findOne({where:{orderId:cart.dataValues.id,productId:id}})){
            await OrderDetail.increment(
                { quantity: 1 },
                {
                  where: {
                    orderId:cart.dataValues.id,
                    productId:id
                  }
                }
            );
        }else{
            await OrderDetail.create({orderId:cart.dataValues.id,productId:id})
        }
        const prod = await Product.findOne({ where: { id: id } });

        let [updatedRows] = await Order.update(
            { total: sequelize.literal(`total + ${prod.price}`) },
            { where: { id: cart.dataValues.id } }
        );
        if (updatedRows > 0) {
        res.json({ message: "Added!", statusCode: 200, data: [] });
        } else {
        next({ message: "Could not update cart", statusCode: 400 });
        }

    } catch (error) {
        console.log(error);
        next({message:"error adding to cart",statusCode:401});
    }
}

export const removeFromCart = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await Order.findOne({
            where: { userId: req.user.id, status: false }
        });

        const orderDetail = await OrderDetail.findOne({
            where: { orderId:order.dataValues.id, productId: id }
        });

        if (orderDetail) {
            const quantity = orderDetail.quantity;
            await OrderDetail.destroy({
                where: {
                    orderId:order.dataValues.id,
                    productId: id,
                }
            });

            const prod = await Product.findOne({ where: { id: id } });
            const total = order.total - (prod.price * quantity);

            await Order.update({ total: total }, { where: { id: order.dataValues.id } });

            res.json({ message: "Item Removed", statusCode: 200, data: [] });
        } else {
            next({ message: "Product is not in your cart", statusCode: 400, data: [] });
        }
    } catch (error) {
        next({ message: "Could not remove item from cart", statusCode: 400, data: [] });
    }
}




// Decrement Product
export const decQuant = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await Order.findOne({
            where: { userId: req.user.id, status: false }
        });

        const orderDetail = await OrderDetail.findOne({
            where:{
                orderId:order.dataValues.id,
                productId: id
            }
        });

        if (orderDetail && orderDetail.quantity === 1) {
            await OrderDetail.destroy({
                where: {
                    orderId:order.dataValues.id,
                    productId: id
                }
            });

            // Retrieve the product's price
            const prod = await Product.findOne({ where: { id: id } });

            await Order.decrement(
                { total: prod.price },
                {
                    where: {
                        id: order.dataValues.id,
                        status: false
                    }
                }
            );
        } else if (orderDetail && orderDetail.quantity > 1) {
            await OrderDetail.decrement(
                { quantity: 1 },
                {
                    where: {
                        orderId:order.dataValues.id,
                        productId: id
                    }
                }
            );

            // Retrieve the product's price
            const prod = await Product.findOne({ where: { id: id } });

            await Order.decrement(
                { total: prod.price },
                {
                    where: {
                        id: order.id,
                        status: false
                    }
                }
            );
        } else {
            next({ message: "Product is not in your cart", statusCode: 400, data: [] });
            return;
        }

        res.json({ message: "Decremented!", statusCode: 200, data: [] });
    } catch (error) {
        next({ message: "Error occurred!", statusCode: 400, data: [] });
    }
}

