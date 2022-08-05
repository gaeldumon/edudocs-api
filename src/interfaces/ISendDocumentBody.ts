export interface ISendDocumentBody {
    file: Buffer,
    studentEmail: string,
    externalEmails: string[]
}