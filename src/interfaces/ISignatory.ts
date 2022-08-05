export interface ISignatory {
    type: "student" | "external",
    id: string,
    elements: [{
        type: string,
        position: { page: string, x: string, y: string }
    }]
}