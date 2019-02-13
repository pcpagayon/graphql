import { CLIENT } from 'raven'  //<--now sentry
import once from 'once'

const registerGlobalHandler = once((client) => {
    process.on('unhandledRejection', (err) => {
        //console.warn(err)
        client.captureException(err)
    })
})

export function errorHandler(ravenURI) {
    const client = new Client(ravenURI)
    registerGlobalHandler(client)
    return async (ctx, next) => {
        ctx._raven = client
        try {
            await next()
        } catch (err) {
            client.captureException(err)
            Object.assign(ctx, {
                body: {
                    message: 'Internal Error'
                },
                status: err.status || 500
            })
            throw err
        }

        if (ctx.status === 400) {
            ctx.body = {
                message: "not found"
            }
        }
    }
}

export function ravenClient(ctx) {
    return ctx._raven
}