import dotenv from 'dotenv';
import path from 'path'
import { fileURLToPath } from "url";
import { DataTypes, Sequelize } from 'sequelize';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({path:path.join(__dirname,"../config/.env")})








export const sequelize = new Sequelize({
  dialect: 'mysql',                
  host: process.env.DB_HOST,       
  port: 3306,                      
  username: process.env.DB_USERNAME, 
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_DATABASE,
  charset: 'utf8mb4',
  collate: 'utf8mb4_general_ci',
});






export const User = sequelize.define('users',{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey: true
    },
    firstname:{
        type: DataTypes.STRING,
        allowNull: false
    },
    lastname:{
        type: DataTypes.STRING,
        allowNull: false
    },
    address:{   
        type: DataTypes.STRING,
        allowNull:false
    },
    email:{
        type: DataTypes.STRING,
        allowNull:false
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    },
    phone:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    address:{
        type: DataTypes.STRING,
        allowNull: false
    },
    role:{
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    resetToken:{
      type: DataTypes.STRING,
      allowNull: true
  },
  
},{timestamps: false});

export const Brand = sequelize.define('brands',{
  id:{
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  }
  ,name:{
      type: DataTypes.STRING,
      allowNull: false
  },
  email:{
      type: DataTypes.STRING,
      allowNull: false
  },
  address:{   
      type: DataTypes.STRING,
      allowNull:false
  },
  phone:{
      type: DataTypes.INTEGER,
      allowNull: false
  },
  logo:{
      type: DataTypes.STRING,
  },
  
},{timestamps: false});

export const Product = sequelize.define('products', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.FLOAT,
  },
  sex: {
    type: DataTypes.STRING,
  },
  image: {
    type: DataTypes.STRING,
  },
  quantity: {
    type: DataTypes.INTEGER,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id',
    },
  },
  
},{timestamps: false});

export const Category = sequelize.define('categories', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  
},{timestamps: false});

export const Order = sequelize.define('orders', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  date:{
    type: DataTypes.DATE,
    allowNull: false,

  },
  total:{
    type: DataTypes.DECIMAL,
    allowNull: false,
  }
}, { timestamps: false });

export const Cart = sequelize.define('carts', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  total:{
    type: DataTypes.DECIMAL,
    defaultValue:0
  }  
},{timestamps: false});

export const CartItem = sequelize.define('CartItem', {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
},{timestamps: false});

export const OrderDetail = sequelize.define('OrderDetail', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
}, { timestamps: false });



User.hasMany(Order);
Order.belongsTo(User);

Brand.hasMany(Product);
Product.belongsTo(Brand);

Order.belongsToMany(Product, { through: OrderDetail });
Product.belongsToMany(Order, { through: OrderDetail });

Product.belongsTo(Category, { foreignKey: 'categoryId' });


Cart.belongsTo(User);
User.hasOne(Cart);


Product.belongsToMany(Cart, { through: CartItem });
Cart.belongsToMany(Product, { through: CartItem });



export async function syncDatabase() {
    try {
      await sequelize.sync();
      console.log('Database synced.');
    } catch (error) {
      console.error('Error syncing database:', error);
    }
}
export default sequelize;