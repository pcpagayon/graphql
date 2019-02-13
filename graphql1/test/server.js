import Koa from 'koa'
import { ApolloServer } from 'apollo-server-koa'
import dotenv from 'dotenv-safe'

import { postgresMiddleware } from '../src/postgres'
import resolvers from '../src/resolvers'
import typeDefs from '../src/types'

import { schema as booksSchema } from '../src/models/books'

const schemas = [booksSchema]

dotenv.load()

const config = {
    db_uri: process.env['DB_URI'] ||
    'postgres://postgres@localhost:5432/test'
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ctx}) => ctx
})

const app = new Koa()
    .use(postgresMiddleware(config.db_uri, schemas))

app.listen({port:4000}, () => {
    console.log(`Server ready at 
    http://localhost:4000${server.graphqlPath}`)
})