import {sequelize} from "../config/database.js";
import {DataTypes} from "sequelize";

export const fetched_songs = sequelize.define("fetchedSong", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        validate: {
            allowNull: false
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            allowEmpty: false,
            len: [2]
        }
    },
    artist: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            allowEmpty: false,
            len: [2]
        }
    },
    tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
    }
});