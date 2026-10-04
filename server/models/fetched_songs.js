import {sequelize} from "../config/database";
import {DataTypes} from "sequelize";

// zeby nie meczyc caly czas req do last fm zapisujemy juz sfetchowane piosenki
// a potem jak juz ja mamy to dane o niej z bazy pobieramy a nie z last.fm
const fetched_songs = sequelize.define("fetchedSong", {
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
        type: DataTypes.ARRAY(DataTypes.ARRAY),

    }
});