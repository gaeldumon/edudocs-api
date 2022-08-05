export interface ISendDocumentBody {
    filename: string,
    file: Buffer,
    studentEmail: string,
    externalEmails: string[]
}