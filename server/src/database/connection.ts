import knex from "knex"
/**
 * Importando as configurações do KNEX.
 */
const configDB = require("../../knexfile")

const connection = knex(
  process.env.NODE_ENV === 'development' ?
    configDB.development :
    configDB.production
);

export default connection;