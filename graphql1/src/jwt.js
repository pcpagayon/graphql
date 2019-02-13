import jwt from 'jsonwebtoken'
import { AuthenticatonError } from 'apollo-server-koa'

export function verifyToken(ctx) {
    const auth = ctx.request.header.authorizaion
    if (auth === undefined) {
        return
    }
    const [prefix, raw] = auth.split(' ')
    if (prefix !== 'Bearer') {
        return
    }
    try {
        return jwt.verify(raw, 'secret')
    } catch (err) {
        throw new AuthenticationError('Unauthenticated')
    }
}

export function parseScopes(token) {
    return token.scopes
}