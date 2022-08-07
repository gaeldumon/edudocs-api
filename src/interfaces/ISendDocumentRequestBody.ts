export interface ISendDocumentRequestBody {
    fileBase64: string | ArrayBuffer | null,
    filename: string,
    studentEmail: string,
    externalEmails: string[]
}