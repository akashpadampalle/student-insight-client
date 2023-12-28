import { useSelector } from "react-redux";
import { MdEdit, MdDeleteForever, MdPreview, MdRefresh } from "react-icons/md"
import { selectAllStudents, selectStudentLoading, studentAdded, studentDeleted, studentLoadingChanged, studentsRecieved } from "./studentSlice";
import Loading from "../../components/Loading";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { ErrorMessage } from "../../models/Error";
import { useState } from "react";
import service from "../../app/service";
import Student from "../../models/Student";
import { resultsRecieved, selectAllResultes } from "../result/resultSlice";
import { errorToast, successToast } from "../../util/toast";

const StudentList = () => {
    const loading = useSelector(selectStudentLoading);
    const [error, setError] = useState<ErrorMessage>()
    const students = useSelector(selectAllStudents);
    const results = useSelector(selectAllResultes)
    const dispatch = useDispatch<AppDispatch>();


    const fetchStudents = async () => {

        dispatch(studentLoadingChanged(true))

        setError(undefined)

        const data = await service.getRequest<Student[]>("student")

        if (data instanceof ErrorMessage) {
            errorToast(data.message)
            setError(data)
        } else {
            successToast("student data fetched successfully.")
            dispatch(studentsRecieved(data))
        }

        dispatch(studentLoadingChanged(false))

    };

    const deleteStudent = async (id: string) => {
        const student = students.find(({ _id }) => _id == id);
        dispatch(studentDeleted(id));
        const data = await service.deleteRequest<undefined>("student/" + id)

        if (data instanceof ErrorMessage && student) {
            errorToast(data.message)
            dispatch(studentAdded(student))
        } else {
            successToast("Student deleted.")
            const newResults = results.filter( result => result.student != id)
            dispatch(resultsRecieved(newResults))
        }


    };

    if (loading) {
        return (
            <div className=" w-full flex justify-center items-center">
                <Loading />
            </div>
        )
    }

    if (error) {
        return (
            <div className=" w-full">
                <div className="text-xl w-full text-red-400 font-semibold text-center">
                {error.message}
                </div>
                <button onClick={fetchStudents} className="flex items-center justify-center gap-2 bg-gray-300 shadow-2xl z-50 p-2 rounded-full border-gray-400 border fixed bottom-5 right-5 "><MdRefresh /> <span>Refresh</span></button>
            </div>
        )
    }

    return (
        <div className="w-full m-8">
            <h1 className="py-2 text-2xl text-center mb-8">List of Students</h1>
            <table className="w-full shadow-2xl">
                <thead>
                    <tr className="bg-blue-400" >
                        <th className="w-2">Sr</th>
                        <th className=" border-gray-500 border-s ">Name</th>
                        <th className=" border-gray-500 border-s ">College</th>
                        <th className=" border-gray-500 border-s w-2 ">Status</th>
                        <th className=" border-gray-500 border-s w-2 px-1">Edit</th>
                        <th className=" border-gray-500 border-s w-2 px-1">Delete</th>
                        <th className=" border-gray-500 border-s w-2 px-1">View</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        students.map((student, index) => (
                            <tr className="even:bg-gray-200 odd:bg-gray-100 text-center " key={student._id}>
                                <td >{index + 1}</td>
                                <td className=" border-gray-300 border-s ">{student.name}</td>
                                <td className=" border-gray-300 border-s">{student.college}</td>
                                <td className="border-gray-300 border-s whitespace-nowrap px-2">{student.status}</td>
                                <td className=" border-gray-300 border-s hover:bg-yellow-100"> <Link to={"edit/" + student._id} className="flex justify-center" ><MdEdit /></Link> </td>
                                <td className="border-gray-300 border-s hover:bg-red-200"> <button onClick={() => { deleteStudent(student._id) }} className="flex w-full justify-center"  ><MdDeleteForever /></button> </td>
                                <td className="border-gray-300 border-s hover:bg-green-200"> <Link to={"/dash/student/"+student._id} className="flex justify-center" ><MdPreview /></Link> </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            <button onClick={fetchStudents} className="flex items-center justify-center gap-2 bg-gray-300 shadow-2xl z-50 p-2 rounded-full border-gray-400 border fixed bottom-5 right-5"><MdRefresh /> <span>Refresh</span></button>

        </div>

    )
}

export default StudentList