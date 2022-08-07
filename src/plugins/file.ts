import fp from 'fastify-plugin'
import {readFile} from "fs/promises";

export interface FilePluginOptions {
    // Specify File plugin options here
}

/**
 * Utilities to perform actions on files in upload/documents.
 */
export default fp<FilePluginOptions>(async (fastify, opts) => {

    fastify.decorate('getBase64', async function (fileName: string) {
        // Get file buffer from file name
        const bitmap = await readFile(`upload/documents/${fileName}`)
        // Returning the Base64 value of the file
        return bitmap.toString("base64")
    })
})

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
    export interface FastifyInstance {
        /**
         * Get the Base64 value of a file in /upload/documents.
         * @param fileName
         */
        getBase64(fileName: string): Promise<string>;
    }
}
