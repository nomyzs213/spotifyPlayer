import {user} from "./user.js";
import {user_token} from "./user_token.js";
import { email_token } from "./email_tokens.js";

user.hasOne(user_token, {
    foreignKey: {
        name: "user_id",
        allowNull: false
    },
    onDelete: "CASCADE"
});

user_token.belongsTo(user, {
    foreignKey: {
        name: "user_id",
        allowNull: false
    }
});

user.hasOne(email_token , {
    foreignKey: {
        name: "user_id",
        allowNull: false
    },
    onDelete: "CASCADE"
});

email_token.belongsTo(user, {
    foreignKey: {
        allowNull: false,
        name: "user_id"
    }
});


export {user , user_token , email_token};