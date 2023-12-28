import Batch from "./Batch"

export type Status = "placed" | "not_placed"

export const statusArray = ["placed", "not_placed"]

export interface CreateStudent {
    name: string,
    college: string,
    batch: string
}

export interface UpdateStudent {
    id: string,
    college?: string,
    status?: string
    dsaFinalScore?: number,
    webFinalScore?: number,
    reactFinalScore?: number,
    batch?: string
}

export  interface PopulatedStudent {
    _id: string,
    name: string,
    college: string,
    status: Status,
    dsaFinalScore: number,
    webFinalScore: number,
    reactFinalScore: number,
    batch: Batch | undefined,
    createdAt: string,
    updatedAt: string
}

export default interface Student {
    _id: string,
    name: string,
    college: string,
    status: Status,
    dsaFinalScore: number,
    webFinalScore: number,
    reactFinalScore: number,
    batch: string | null,
    createdAt: string,
    updatedAt: string
}