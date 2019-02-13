import chai, {expect} from 'chai'
// import chaiSubset from 'chai-subset'
import { isTerminating } from 'apollo-link/lib/linkUtils';
import { doesNotReject } from 'assert';

const url = 'http://localhost:4000'

const request = require('supertest')(url)

describe('GraphQL', () => {
    it('Posts Books', async () => {
        const mutation =`
            mutation{
                createBook(
                    book: {
                        title: "Manila',
                        author: 'javascript'
                    }
                ){
                    ... on CreateBookSuccess{id},
                    ... on CreateBookError{message}
                }
            }`
        request.post('/graphql')
            .send({
                query: mutation
            })
            .expect(200)
            .end((err, res) => {
                expect(res.body.data.createBook.id).to.not.be.undefined
                done()
            })

    })
    it('Updates Books', async () => {
        const mutation = `
            mutation{
                updateBook{
                    id: 2,
                    book: {
                        title: "Amagi",
                        author: "Academy"
                    }
                }{id}
            }`
        request.post('/graphql')
            .send({
                query: mutation
            })
            .expect(200)
            .end((err, res) => {
                expect(res.body.data.updateBook.id).to.not.be.undefined
            })
    })
})