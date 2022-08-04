import {ISignatory} from "./ISignatory";

export interface ISendDocPayload {
    user_id: string,
    document: { name: string, base64: string },
    // if true, send the signed document to the recipients once the document is signed
    sendDocumentToRecipients: boolean,
    signatories: ISignatory[],
    // if sms is chosen, the recipients must have the field PHONE completed in the endpoints Externals or Students
    validateSignatureBy: "email" | "sms",
    emailReminder: {
        // maximum 5
        amount: number,
        // in hours
        interval: number
    },
    directoryId: string
}