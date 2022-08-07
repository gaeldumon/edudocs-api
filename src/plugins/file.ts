import fp from 'fastify-plugin'
import {PathLike} from 'fs';
import {FileHandle, readFile} from "fs/promises";
import * as path from "path";

export interface FilePluginOptions {
    // Specify File plugin options here
}

/**
 * Utilities to perform actions on files.
 */
export default fp<FilePluginOptions>(async (fastify, opts) => {

    fastify.decorate('getBase64', async function (file: PathLike | FileHandle) {
        // Get file buffer from file
        const bitmap = await readFile(file)
        // Returning the Base64 value of the file
        return bitmap.toString("base64")
    })

    fastify.decorate('isPdf', async function (filename: string) {
        return path.extname(filename) === ".pdf"
    })
})

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
    export interface FastifyInstance {
        /**
         * Get the Base64 value of a file data.
         * @param file
         */
        getBase64(file: PathLike | FileHandle): Promise<string>;

        /**
         * Returns true if the file extension is pdf, false otherwise.
         * @param filename
         */
        isPdf(filename: string): boolean
    }
}
