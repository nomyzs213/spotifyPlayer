import {DataTypes} from "sequelize";
import {sequelize} from "../config/database.js";

export const user_token = sequelize.define("Token" , {
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true

    },

    access_token: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate:{
            notEmpty: true
        }

    },

    access_token_expiry: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },


    refresh_token: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },

    refresh_token_expiry: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
})
