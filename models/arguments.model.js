import { DataTypes, Model } from "sequelize";
import { sequelize } from "./db/sqlConfig.js";

class Argument extends Model {}

const ArgumentModel = Argument.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    method_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "Method", key: "page_id" }
    },
    arg_index: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    description: DataTypes.TEXT
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true
  }
);


export { ArgumentModel as Argument };
