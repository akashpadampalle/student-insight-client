import Interview from "./Interview"
import Student from "./Student"

export type Status = "PASS" | "FAIL" | "On Hold" | "Didn’t Attempt"
export const statusArray = ["PASS" , "FAIL" , "On Hold" , "Didn’t Attempt"]


export default interface Result {
    _id: string,
    student: string,
    interview: string,
    status: Status,
    createdAt: string,
    updatedAt: string
}


export interface ResultPopulated {
    _id: string,
    student: Student,
    interview: Interview,
    status: Status,
    createdAt: string,
    updatedAt: string
}