import {FastifyPluginAsync} from 'fastify'
import got from "got";

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

    fastify.get('/', async function (request, reply) {
        return "Welcome to the EduDocs API"
    })

    fastify.get('/student-by-email/:email', async function (request, reply) {
        // @ts-ignore
        const studentEmail = request.params.email;
        const edusignUrl = `https://ext.edusign.fr/v1/student/by-email/${studentEmail}`
        const headers = {
            'Authorization': `Bearer ${process.env.EDUSIGN_BEARER_TOKEN}`,
            'Content-Type': 'application/json'
        }
        return got(edusignUrl, {headers}).json();
    })
}

export default root;
