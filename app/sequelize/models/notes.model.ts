import { DataTypes, Model } from "sequelize";
import sequelize from "../db.server";
import { TNote } from "~/Types/Note";

export class Notes extends Model<TNote> {}

try {
  Notes.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4, // Automatically generate a UUID if not provided
      },
      userid: {
        type: DataTypes.STRING,
        allowNull: false,
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
        defaultValue: DataTypes.NOW, // Automatically set the current timestamp
      },
      updated_at: {
        type: DataTypes.DATE,
      },
      status: {
        type: DataTypes.STRING,
      },

    },
    {
      sequelize,
      modelName: "Notes",
      tableName: "notes",
      timestamps: false, // Disable Sequelize's automatic timestamps
    }
  );

  // Sync the model with the database
  (async () => {
    await Notes.sync()
      .then(() => {
        console.log("Notes Sync Successful!");
      })
      .catch((error) => {
        console.error("Error during Notes Sync:", error.message);
      });
  })();
} catch (error) {
  console.error(
    "Error initializing the Notes model:",
    (error as Error).message
  );
}

export default Notes;
