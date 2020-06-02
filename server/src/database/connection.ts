import knex from 'knex'
import pach from 'path'

const connection = knex({
    client: 'sqlite3',
    connection: {
        filename: pach.resolve(__dirname, 'database.sqlite')
    },
    useNullAsDefault: true
})

export default connection;