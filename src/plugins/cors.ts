import fp from 'fastify-plugin'
import cors, {FastifyCorsOptions} from '@fastify/cors'

/**
 * Enabling CORS requests
 */
export default fp<FastifyCorsOptions>(async (fastify, opts) => {
    fastify.register(cors)
})