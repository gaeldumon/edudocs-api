import fastify from 'fastify'
import { ISendDocPayload } from "./interfaces/ISendDocPayload";

const server = fastify()

server.get('/', async (request, reply) => {
    return 'Welcome to the edudocs API'
})

server.post('/send-doc', async (request, reply) => {
    return ''
})

server.listen({port: 3000}, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})