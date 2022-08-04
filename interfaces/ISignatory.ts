export interface ISignatory {
    type: "student" | "external"
    // id of the student or external that has to sign the document (max 1 student)
    id: string,
    elements: [{
        type: string,
        position: {
            // Starts at 1
            page: string,
            x: string,
            y: string
        }
    }]
}
