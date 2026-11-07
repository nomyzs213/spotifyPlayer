import pkg from "sequelize";
const { DataTypes } = pkg;
import {sequelize} from "../config/database.js";

export const email_token = sequelize.define("Email_token", {
    user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    token_expiry: {
        type: DataTypes.DATE,
        allowNull: false
    },
    tries: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            max: 5,
            min: 0
        }
    },
    reset_secret: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
});


