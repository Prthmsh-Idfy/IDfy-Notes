import {DataTypes,Model } from "sequelize";
import sequelize from "../db.server";
import { TNote } from "~/Types/Note";

export class Notes extends Model<TNote> {}
    Notes.init({
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      body: {
        type: DataTypes.TEXT,
      },
      stared: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
      },
    }, {
      sequelize,
      modelName: 'Notes',
      tableName: 'notes',
      timestamps: false,
    });
// export default Notes;