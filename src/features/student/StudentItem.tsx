import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { AppDispatch, RootState } from "../../app/store";
import { studentDeleted, selectStudentById } from "./studentSlice";
import { format } from "date-fns"
import { MdDeleteForever, MdEdit } from "react-icons/md";
import service from "../../app/service";
import { ErrorMessage } from "../../models/Error";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectBatchById } from "../batch/batchSlice";
import { resultsRecieved, selectAllResultes } from "../result/resultSlice";
import { PopulatedStudent } from "../../models/Student";
import { errorToast, successToast } from "../../util/toast";

const StudentItem = () => {

  const { id } = useParams();
  const student = useSelector((state: RootState) => selectStudentById(state, id || ""));
  const batch = useSelector((state: RootState) => selectBatchById(state, student?.batch || ""));
  const results = useSelector(selectAllResultes)
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const deleteStudent = async () => {

    const data = await service.deleteRequest<undefined>("student/" + id);

    if (data instanceof ErrorMessage && student) {
      errorToast(data.message);
    } else {
      successToast(`${student.name} deleted.`);
      const newResults = results.filter(result => result.student != id);
      dispatch(resultsRecieved(newResults));
      dispatch(studentDeleted(id || ""));
      navigate("/dash/student");
    }


  };



  if (!student) {
    return (
      <div>
        <h1>Unable to find required student</h1>
        <Link to={"/dash/student"} >Student List</Link>
      </div>
    )
  }

  console.log(student)

  const populatedStudent: PopulatedStudent = { ...student, batch };

  return (
    <div className="w-full m-8">


      <section className="m-auto w-fit p-8 bg-slate-50 shadow-xl">
        <h1 className="mb-8 text-xl flex justify-between">
          <span>Student</span>
          <span className="flex gap-2 items-center">
            <Link to={"/dash/student/edit/" + student._id}><MdEdit /></Link>
            <button onClick={deleteStudent}><MdDeleteForever /></button>
          </span>
        </h1>
        <table>
          <tbody>
            <tr>
              <td className="text-right">Student Name : </td>
              <td className="pl-4">{populatedStudent.name}</td>
            </tr>
            <tr>
              <td className="text-right">Student ID : </td>
              <td className="pl-4">{populatedStudent._id}</td>
            </tr>
            <tr>
              <td className="text-right">Status : </td>
              <td className="pl-4">{populatedStudent.status}</td>
            </tr>
            <tr>
              <td className="text-right">Batch Name : </td>
              <td className="pl-4">{populatedStudent.batch?.name || "Not Assigned"}</td>
            </tr>
            <tr>
              <td className="text-right">Batch ID : </td>
              <td className="pl-4">{populatedStudent.batch?._id || "Not Available"}</td>
            </tr>
            <tr>
              <td className="text-right">College : </td>
              <td className="pl-4">{populatedStudent.college}</td>
            </tr>
            <tr>
              <td className="text-right">DSA Final Score : </td>
              <td className="pl-4">{populatedStudent.dsaFinalScore}</td>
            </tr>
            <tr>
              <td className="text-right">Web Final Score : </td>
              <td className="pl-4">{populatedStudent.webFinalScore}</td>
            </tr>
            <tr>
              <td className="text-right">React Final Score : </td>
              <td className="pl-4">{populatedStudent.reactFinalScore}</td>
            </tr>
            <tr>
              <td className="text-right">CreatedAt : </td>
              <td className="pl-4">{format(new Date(populatedStudent.createdAt), "dd MMM yyyy hh:mm:ss a")}</td>
            </tr>
            <tr>
              <td className="text-right">UpdatedAt : </td>
              <td className="pl-4">{format(new Date(populatedStudent.updatedAt), "dd MMM yyyy hh:mm:ss a")}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default StudentItem;