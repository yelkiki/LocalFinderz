import express from 'express';
import { authRouter, userRouter } from './src/routes/indexRouter.js';
import sequelize, { syncDatabase } from './database/sql.js';
import ErrorHandler from './src/middleware/errorHandler.js';
import cors from 'cors';

// use sqlite aw postgreSQL
// shoof docker 3shan el app yeshta8al 3ala kol el machines

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth",authRouter);
app.use("/user",userRouter);
app.use("*",()=>{
    res.json("Invalid router")
    console.log("Invalid router");
});
app.use(ErrorHandler);


try {
    await sequelize.authenticate()
    console.log('connected successfully (mysql)');
} catch (error) {
    console.log('Failed to connect to sql');
}

app.listen(3000,()=>{
    console.log("Listening on localhost port 3000!");
})