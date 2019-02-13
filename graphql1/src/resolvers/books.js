import Books from '~/models/books'
import {postgres} from '~/postgres'

const Book = Books()

export default {
    Query: {
        books: async (_, __, ctx) => {
            const books = await Book.retrieveAll(postgres(ctx))
            return books
        },
        book: async (_, {id}, ctx) => {
            const books = await Book.retrieve(postgres(ctx), id)
            return book
        }
    },
    Mutation: {
        createBook: async(_, {book}, ctx) => {
            const id = await Book.create(postgres(ctx), book)
            return {id}
        },
        updateBook: async(_, {book}, ctx) => {
            const id = await Book.update(postgres(ctx), book, id)
            return {id}
        },
        deleteBook: async(_, {book}, ctx) => {
            const id = await Book.del(postgres(ctx), id)
            return {id}
        }
    },
    CreateBookPayload: {
        __resolveType(obj) {
            if (obj.id) {
                return 'CreateBookSuccess'
            }
            if (obj.message) {
                return 'CreateBookError'
            }
            return null
        }
    }
}