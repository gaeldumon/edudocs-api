import {FastifyPluginAsync} from 'fastify'
import got from "got";
import {apiHeaders} from "../globals/headers";
import {ISendDocumentRequestBody} from "../interfaces/ISendDocumentRequestBody";
import {ISignatory} from "../interfaces/ISignatory";

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

    /**
     * Welcome route.
     */
    fastify.get('/', async function (request, reply) {
        return "Welcome to the EduDocs API"
    })

    /**
     * Can perform various checks on the document (extension, quality...).
     */
    fastify.post('/verify-document', async function (request, reply) {
        const fileData = await request.file()
        if (!this.isPdf(fileData.filename)) {
            reply.statusCode = 500
            return {status: "error", message: "only pdf files are allowed"}
        }
        return {status: "accepted"}
    })

    /**
     * Effectively send the document to the recipients with the Edusign Base64 document sender endpoint.
     */
    fastify.post('/send-document', async function (request, reply) {
        // @ts-ignore
        const body: ISendDocumentRequestBody = request.body

        const fileBase64 = body.fileBase64
        const filename = body.filename
        const studentId = await this.getStudentIdByEmail(body.studentEmail)
        const externalIds = await this.getExternalIdsByEmails(body.externalEmails)

        const signatories: ISignatory[] = []

        // Default document's signature element
        const defaultSignatureElement = {type: "", position: {page: "1", x: "200", y: "200"}}

        // Pushing the only student first
        signatories.push({type: "student", id: studentId, elements: [defaultSignatureElement]})

        // Pushing the externals
        for (const externalId of externalIds) {
            signatories.push({type: "external", id: externalId, elements: [defaultSignatureElement]})
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
