import fp from 'fastify-plugin'
import got from "got";
import {apiHeaders} from "../globals/headers";

export interface EdusignPluginOptions {
    // Specify Edusign plugin options here
}

/**
 * Wrappers to fetch the Edusign endpoints in search of ressources fields to help with other requests.
 */
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
        /**
         * Returns a student id based on its email.
         * Fetched edusign endpoint: https://ext.edusign.fr/v1/student/by-email/:email
         */
        getStudentIdByEmail(email: string): Promise<string>,

        /**
         * Returns an array of externals (teacher, speaker...) ids based on an array of externals emails.
         * Fetched edusign endpoint: https://ext.edusign.fr/v1/externals/by-email/:email
         */
        getExternalIdsByEmails(emails: string[]): Promise<string[]>
    }
}
