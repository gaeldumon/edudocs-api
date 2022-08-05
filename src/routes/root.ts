import {FastifyPluginAsync} from 'fastify'
import got from "got";
import {apiHeaders} from "../globals/headers";
import {ISendDocumentBody} from "../interfaces/ISendDocumentBody";
import {ISignatory} from "../interfaces/ISignatory";
import {readFile} from "fs/promises";

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
        const body: ISendDocumentBody = request.body

        // TODO : rework this path access
        // Get file buffer from file name
        const bitmap = await readFile(`upload/documents/${body.filename}`)

        // Saving the Base64 value of the file
        const fileBase64 = bitmap.toString("base64")

        // If using a file buffer directly sent by front
        //const fileBase64: string = body.file.toString('base64')

        const studentId: string = await getStudentIdByEmail(body.studentEmail)
        const externalIds: string[] = await getExternalIdsByEmails(body.externalEmails)

        const signatories: ISignatory[] = []

        // Just an empty document's element
        const defaultElement = {type: "", position: {page: "", x: "", y: ""}}

        // Pushing the only student first
        signatories.push({type: "student", id: studentId, elements: [defaultElement]})

        // Pushing the externals
        for (const externalId of externalIds) {
            signatories.push({type: "external", id: externalId, elements: [defaultElement]})
        }

        const payload = {
            user_id: process.env.EDUSIGN_USER_ID,
            document: {name: body.filename, base64: fileBase64},
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
