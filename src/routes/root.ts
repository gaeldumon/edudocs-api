import {FastifyPluginAsync} from 'fastify'
import got from "got";
import {apiHeaders} from "../globals/headers";
import {ISendDocumentRequestBody} from "../interfaces/ISendDocumentRequestBody";
import {ISignatory} from "../interfaces/ISignatory";

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

    fastify.get('/', async function (request, reply) {
        return "Welcome to the EduDocs API"
    })

    fastify.post('/verify-document', async function (request, reply) {
        const fileData = await request.file()
        if (!this.isPdf(fileData.filename)) {
            return { status: "error", message: "only pdf files are allowed" }
        }
        return { status: "accepted" }
    })

    fastify.post('/send-document', async function (request, reply) {
        // @ts-ignore
        const body: ISendDocumentRequestBody = request.body

        const fileBase64 = body.fileBase64
        const filename = body.filename
        const studentId = await this.getStudentIdByEmail(body.studentEmail)
        const externalIds = await this.getExternalIdsByEmails(body.externalEmails)

        const signatories: ISignatory[] = []

        // Just an empty document's element for convenience
        const defaultElement = {type: "", position: {page: "", x: "", y: ""}}

        // Pushing the only student first
        signatories.push({type: "student", id: studentId, elements: [defaultElement]})

        // Pushing the externals
        for (const externalId of externalIds) {
            signatories.push({type: "external", id: externalId, elements: [defaultElement]})
        }

        const payload = {
            user_id: process.env.EDUSIGN_USER_ID,
            document: {name: filename, base64: fileBase64},
            sendDocumentToRecipients: true,
            signatories,
            validateSignatureBy: "email",
            emailReminder: {amount: 1, interval: 1},
            directoryId: ""
        }

        const sendDocUrl = 'https://ext.edusign.fr/v1/document/v2/send-base64'

        const {status, message, result} = await got.post(sendDocUrl, {headers: apiHeaders, json: payload}).json()

        return {status, message, result}
    })
}

export default root;
