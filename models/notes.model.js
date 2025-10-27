import { DataTypes, Model } from "sequelize";
import { sequelize } from "./db/sqlConfig.js";
import {Op} from "sequelize";

/*
    * Note model representing notes in the database.
    * THIS FILE IS UNNECESSARY FOR FINAL PRODUCT
*/
class Note extends Model {
    static async findTop() {
        return await this.findAll({ limit: 5 });
    }

    static async findLikeTitle(query) {
        return await this.findAll({
            where: {
                title: {
                    [Op.like]: `%${query}%`
                }
            }
        });
    }

    static async updateById(id, updates) {
        const note = await this.findByPk(id);
        if (!note) return null;
        return await note.update(updates);
    }

    static async delete(id) {
        const note = await this.findByPk(id);
        if (!note) return null;
        return await note.destroy();
    }
}

const NoteModal = Note.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },
    {
        sequelize,
        timestamps: true,
        paranoid: false,
        hooks: {},
        freezeTableName: true
    }
);

NoteModal.sync();

export { NoteModal as Note}