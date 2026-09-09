import {DataTypes} from "sequelize";
import {sequelize} from "../config/database.js";

export const user_token = await sequelize.define("Token" , {
    user_id: {
        type: DataTypes.UUID,
        validate: {
            allowNull: false,
            unique: true
        }
    },

    access_token: {
        type: DataTypes.TEXT,
        validate: {
            allowNull: false,
            notEmpty: true
        }
    },

    expires_at: {
        type: DataTypes.DATE,
        validate: {
            allowNull: false
        }
    },


    refresh_token: {
        type: DataTypes.TEXT,
        validate: {
            allowNull: false,
            notEmpty: true
        }
    }
})
