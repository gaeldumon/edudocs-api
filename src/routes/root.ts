import {FastifyPluginAsync} from 'fastify'
import got from "got";
import {apiHeaders} from "../globals/headers";
import {ISendDocumentBody} from "../interfaces/ISendDocumentBody";
import {ISignatory} from "../interfaces/ISignatory";
import {writeFile} from "fs/promises";

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

    fastify.get('/', async function (request, reply) {
        return "Welcome to the EduDocs API"
    })

    fastify.post('/upload-document', async function (request, reply) {
        const data = await request.file()
        return await writeFile(`upload/documents/${data.filename}`, data.file)
    })

    fastify.post('/send-document', async function (request, reply) {
        // @ts-ignore
        const body: ISendDocumentBody = request.body

        const filename: string = body.filename
        const fileBase64: string = await this.getBase64(filename)
        const studentId: string = await this.getStudentIdByEmail(body.studentEmail)
        const externalIds: string[] = await this.getExternalIdsByEmails(body.externalEmails)

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
