import { DataTypes, Model } from "sequelize";
import sequelize from "../db.server";
import { TUser } from "~/Types/User";
import { Notes } from "./notes.model";

export class Users extends Model<TUser> {}
Users.init(
  {
    userid: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: "Users",
    tableName: "users",
    timestamps: false,
  }
);
(async () => {
  await Users.sync()
    .then(() => {
      console.log("Users Sync Successful!");
    })
    .catch((error) => {
      console.error("Error during Users Sync:", error.message);
    });
})();
Users.hasMany(Notes, { foreignKey: "userid" });
