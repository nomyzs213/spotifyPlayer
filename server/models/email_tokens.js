import { DataTypes, Sequelize } from "sequelize";

export const email_token = Sequelize.define("Email_token", {
    user_id: {
        type: DataTypes.UUID,
        default: UUUIDV4,
        allowNull: false
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
});


