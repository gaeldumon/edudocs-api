import {FastifyPluginAsync} from 'fastify'
import got from "got";
import {apiHeaders} from "../globals/headers";
import {ISendDocumentBody} from "../interfaces/ISendDocumentBody";

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

    async function getStudentIdByEmail(email: string): Promise<string> {
        const url = `https://ext.edusign.fr/v1/student/by-email/${email}`
        const {result} = await got(url, {headers: apiHeaders}).json()
        return result.id
    }

    async function getExternalIdsByEmails(emails: string[]): Promise<string[]> {
        let ids = []
        for (const email of emails) {
            const url = `https://ext.edusign.fr/v1/externals/by-email/${email}`
            const {result} = await got(url, {headers: apiHeaders}).json()
            ids.push(result.ID)
        }
        return ids
    }

    fastify.get('/', async function (request, reply) {
        return "Welcome to the EduDocs API"
    })

    fastify.post('/send-document', async function (request, reply) {
        // @ts-ignore
        const payload: ISendDocumentBody = request.body
        const fileBase64 = payload.file.toString('base64')
        const studentId = await getStudentIdByEmail(payload.studentEmail)
        const externalIds = await getExternalIdsByEmails(payload.externalEmails)

        return {fileBase64, studentId, externalIds}
    })
}

export default root;
