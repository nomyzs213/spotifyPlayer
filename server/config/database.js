import {DataTypes, Sequelize} from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize( process.env.USER , process.env.USER, process.env.PASSWORD , {
    dialect: process.env.DIALECT,
    host: "localhost"
});



try{
    await sequelize.authenticate();
}

catch (error){
    console.error(error.message);
}


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

await sequelize.sync();

export const user_token = await sequelize.define("tokens" , {
    id: {
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

user.hasOne(user_token, {
    foreignKey: {
        name: "fk_user_id",
        allowNull: false
    },
    onDelete: "CASCADE"
});

user_token.belongsTo(user, {
    foreignKey: {
        name: "fk_user_id",
        allowNull: false
    }
});

await sequelize.sync();




