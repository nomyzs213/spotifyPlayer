import dotenv from "dotenv";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {Sequelize} from "sequelize";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });


export const sequelize = new Sequelize( String(process.env.DB_NAME) , String(process.env.DB_USER), String(process.env.DB_PASSWORD) , {
    dialect: "postgres",
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










