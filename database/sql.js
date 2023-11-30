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
    }
})

export const Product = sequelize.define('Product', {
    name: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.FLOAT,
    },
    category: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
    quantity: {
      type: DataTypes.INTEGER,
    },
  });


export async function syncDatabase() {
    try {
      await sequelize.sync();
      console.log('Database synced.');
    } catch (error) {
      console.error('Error syncing database:', error);
    }
}
export default sequelize;