import inquirer from "inquirer";
import fs from "fs-extra";
import { Sequelize } from "sequelize";
import path from "path";
import {Notes} from "~/sequelize/models/notes.model";
import {Users} from "~/sequelize/models/users.model";




async function createConfig() {
  try {

    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "database",
        message: "Database name:",
        validate: (input) => (input ? true : "Database name cannot be empty."),
      },
      {
        type: "input",
        name: "username",
        message: "Username:",
        validate: (input) => (input ? true : "Username cannot be empty."),
      },
      {
        type: "password",
        name: "password",
        message: "Password (leave empty for no password):",
      },
      {
        type: "input",
        name: "host",
        message: "Host name:",
        default: "127.0.0.1",
        validate: (input) => (input ? true : "Host name cannot be empty."),
      }
    ]);
    const dbconfig = {
      database: answers.database,
      username: answers.username,
      password: answers.password || null,
      host: answers.host,
    };

    const dbconfigpath = path.resolve("./app/sequelize/db.config.json");
    await fs.writeJSON(dbconfigpath, dbconfig, { spaces: 2 });

    console.log(`Database configuration file created at: ${dbconfigpath}`);

    // Test database connection
    const sequelizeTest = new Sequelize(
      dbconfig.database,
      dbconfig.username,
      dbconfig.password,
      {
        host: dbconfig.host,
        dialect: "postgres", 
        logging: false,
      }
    );

    await sequelizeTest.authenticate();
    console.log("Database connection established successfully.");
    process.exit(0);
  } catch (error) {
    if (error instanceof Error) {
      console.error("An error occurred:", error.message);
    } else {
      console.error("An unknown error occurred.");
    }
    process.exit(1);
  }
}

createConfig();
