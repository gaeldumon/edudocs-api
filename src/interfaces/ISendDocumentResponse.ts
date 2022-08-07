export interface ISendDocumentResponse {
    status: "success" | "error",
    message: string,
    result: {
        nbrDocumentsSuccess: number,
        errors: string[],
        documentIds: string[]
    }
}