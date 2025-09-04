import { DataTypes, Model } from "sequelize";
import { sequelize } from "./db/sqlConfig.js";

class Note extends Model {
    static async findTop() {
        return await this.findAll({ limit: 5 });
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
        paranoid: true,
        hooks: {},
        freezeTableName: true
    }
);

NoteModal.sync();

export { NoteModal as Note}