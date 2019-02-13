import Koa from 'koa'
import { ApolloServer } from 'apollo-server-koa'
import dotenv from 'dotenv-safe'

import { postgresMiddleware } from './postgres'
import resolvers from './resolvers'
import typeDefs from './types'


import { schema as booksSchema, schema } from './models/books'
import AuthDirective from './directives/auth';

const schemas = [booksSchema]

dotenv.load()

const config = {
    db_uri: process.env['DB_URI'] ||
        'postgres://postgres@localhost:5432/academy',
        production: process.env['NODE_ENV'] ==='production',
        port: process.env['BACKEND PORT'],
        default_db: process.env['DEFAULT DB']
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    schemaDirectives: {
        auth: AuthDirective
    },
    context: ({ctx}) => ctx,
    playground: {
        settings: {
            'editor.cursorShape': 'line'
        }
    }
})

const app = new Koa()
    .use(postgresMiddleware(config.db_uri, schema))

server.applyMiddleware({app})

app.listen({port:4000}, () => {
    console.log(`Server ready at http://localhost:4000/${server.graphqlPath}`)
})