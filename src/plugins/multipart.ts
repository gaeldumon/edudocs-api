import fp from 'fastify-plugin'
import multipart, {FastifyMultipartOptions} from '@fastify/multipart'

/**
 * Enabling file upload across request.
 */
export default fp<FastifyMultipartOptions>(async (fastify, opts) => {
    fastify.register(multipart)
})