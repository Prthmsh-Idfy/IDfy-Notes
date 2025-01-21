import { Sequelize } from "sequelize";
import config from "./db.config.json";

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: "postgres",
  }
);
if (sequelize) {
  console.log("Connected to the database");
}
export default sequelize;
