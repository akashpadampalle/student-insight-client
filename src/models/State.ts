import Batch from "./Batch";
import Interview from "./Interview";
import Result from "./Result";
import Student from "./Student";

export default interface State {
    batches: Batch[],
    interviews: Interview[],
    results: Result[]
    students: Student[],
}