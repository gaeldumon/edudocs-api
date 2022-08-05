import {ISignatory} from "./ISignatory";

export interface ISendDocumentPayload {
    user_id: string,
    document: { name: string, base64: string },
    sendDocumentToRecipients: boolean,
    signatories: ISignatory[],
    validateSignatureBy: "email" | "sms",
    emailReminder: { amount: number, interval: number },
    directoryId: string
}