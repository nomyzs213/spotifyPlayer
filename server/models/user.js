import {DataTypes} from "sequelize";
import {sequelize} from "../config/database.js";

export const user =  sequelize.define("User" , {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            len: [3 , 255],
            isEmail: true,
            isLowercase: true,
            notEmpty: true
        }
    },
    username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            len: [3 , 100],
            isLowercase: true,
            notEmpty: true
        }
    },
    password_hash: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
} )