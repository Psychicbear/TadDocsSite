import { DataTypes, Model } from "sequelize";
import { sequelize } from "./db/sqlConfig.js";

/*
    * Argument model representing method/function arguments in the database.
    * THIS FILE ONLY DEFINES THE MODEL AND ITS SCHEMA.
    * INTERACTIONS WITH THE MODEL SHOULD BE HANDLED IN INTERFACE FILES.
    * ASSOCIATIONS ARE DEFINED IN INDEX MODEL FILE.
*/

class Argument extends Model {}

const ArgumentModel = Argument.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
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
