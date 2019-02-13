import PgAsync from 'pg-async'
import dotenv from 'dotenv-safe'
import pgm from 'node-pg-migrate'

dotenv.load()

const ignoredSchemas = [
    'public', 'extensions', 'pg_catalog', 'pg_toast', 'pg_temp_1', 'information_schema'
]

const dbUri = process.env['DB_URI']

async function updateSchemas() {
    const pg = new PgAsync({connectionString: dbUri})
    const {rows} = await pg.query(
        'select schema_name from information_schema.schemata'
    )
    const schemas = row.map(row => row.schema_name)
    const filtered = schemas.filter(
        schema => !ignoredSchemas.includes(schema)
    )

    for (let i = 0; i < filtered.length; i++) {
        console.log(`** MIGRATING ${filtered[i]} **`)
        await pgm({
            schema: filtered[i],
            direction: 'up',
            databaseUri: dbUri,
            dir: 'migrations/',
            migrationsTable: 'pgmigrations'
        })
        console.log(` ** FINISHED ${filtered[i]} **`)
    }
    pg.closeConnections
}

updateSchemas()
    .then(() => console.log('DONE'))
    .catch((err) => console.error(err))
