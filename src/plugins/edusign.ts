import fp from 'fastify-plugin'
import got from "got";
import {apiHeaders} from "../globals/headers";

export interface EdusignPluginOptions {
    // Specify Edusign plugin options here
}

// The use of fastify-plugin is required to be able to export the decorators to the outer scope
export default fp<EdusignPluginOptions>(async (fastify, opts) => {

    fastify.decorate('getStudentIdByEmail', async function (email: string) {
        const url = `https://ext.edusign.fr/v1/student/by-email/${email}`
        const {result} = await got(url, {headers: apiHeaders}).json()
        return result.id
    })

    fastify.decorate('getExternalIdsByEmails', async function (emails: string[]) {
        let ids = []
        for (const email of emails) {
            const url = `https://ext.edusign.fr/v1/externals/by-email/${email}`
            const {result} = await got(url, {headers: apiHeaders}).json()
            ids.push(result.ID)
        }
        return ids
    })
})

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
    export interface FastifyInstance {
        getStudentIdByEmail(email: string): Promise<string>,

        getExternalIdsByEmails(emails: string[]): Promise<string[]>
    }
}
