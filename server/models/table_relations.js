import {user} from "./user.js";
import {user_token} from "./user_token.js";

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

export {user , user_token};