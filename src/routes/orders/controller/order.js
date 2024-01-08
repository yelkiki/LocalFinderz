import sequelize, { Order, OrderDetail, Product } from "../../../../database/sql.js"




export const placeOrder = async (req, res, next) => {
    try {
        const order = await Order.findOne({
            where: { userId: req.user.id, status: false }
        });

        if (!order || order.total === 0) {
            next({ message: "Your cart is empty", statusCode: 400 });
        } else {
            const currentDate = new Date();
            await Order.update({ status: true, date: currentDate }, {
                where: { id: order.dataValues.id }
            });

            res.json({ message: "Order placed successfully", statusCode: 200, data: [] });
        }
    } catch (error) {
        console.log(error);
        next({ message: "Could not place order", statusCode: 400, data: error });
    }
}

export const orderDetails = async (req, res, next) => {
    const { orderId } = req.body;
    try {
        const order = await Order.findOne({
            where: { id: orderId },
            attributes: ['date', 'total'],
            include: [{ 
                model: Product,
                attributes: ['name', 'price', 'image'],
                through: { 
                    attributes: ['quantity'] 
                },
                as: 'products'
            }]
        });

        if (!order) {
            return next({ message: "Order not found", statusCode: 404, data: null });
        }

        const formattedProducts = order.products.map(product => ({
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: product.OrderDetail.quantity
        }));

        res.json({ 
            message: "Found", 
            statusCode: 200, 
            data: {
                date: order.date,
                total: order.total,
                products: formattedProducts
            }
        });
    } catch (error) {
        console.log(error);
        next({ message: "Could not view order details", statusCode: 400, data: error });
    }
}
