
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('postgres', 'postgres', 'Pinu#123', {
    host: 'localhost',
    dialect: 'postgres'
  });
if(sequelize){
    console.log("Connected to the database");   
}
export default sequelize;