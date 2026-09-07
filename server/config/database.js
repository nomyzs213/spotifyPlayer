import {Sequelize} from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize( process.env.DB_NAME , process.env.DB_USER, process.env.DB_PASSWORD , {
    dialect: process.env.DIALECT,
    host: "localhost"
});

export const startDb = async ()=> {
    try{
        await sequelize.authenticate();
        await sequelize.sync();
    }
    catch(error){
        console.error(error);
         process.exit(1);
    }
}










