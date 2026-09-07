import {DataTypes} from "sequelize";
import {sequelize} from "../config/database.js";

export const user = await sequelize.define("User" , {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        validate: {
            allowNull: false
        }
    },
    email: {
        type: DataTypes.STRING(255),
        validate: {
            len: [3 , 255],
            isEmail: true,
            unique: true,
            allowNull: false,
            notEmpty: true
        }
    },
    username: {
        type: DataTypes.STRING(255),
        validate: {
            allowNull: false,
            len: [3 , 255],
            isLowercase: true,
            unique: true,
            notEmpty: true
        }
    },
    password_hash: {
        type: DataTypes.STRING(255),
        validate: {
            len: [8 , 255],
            allowNull: false,
            notEmpty: true
        }
    }
} )