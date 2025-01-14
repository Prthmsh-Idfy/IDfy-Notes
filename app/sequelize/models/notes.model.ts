import { Sequelize,DataTypes,Model } from "sequelize";
import sequelize from "../db.server";

export class Notes extends Model {}
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