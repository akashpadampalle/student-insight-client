import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { AppDispatch, RootState } from "../../app/store";
import { resultDeleted, selectAllResultes, selectResultById, resultsRecieved } from "./resultSlice";
import { format } from "date-fns"
import { MdDeleteForever, MdEdit } from "react-icons/md";
import service from "../../app/service";
import { ErrorMessage } from "../../models/Error";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectInterviewById } from "../interview/interviewSlice";
import { ResultPopulated } from "../../models/Result";
import { selectStudentById } from "../student/studentSlice";
import { errorToast, successToast } from "../../util/toast";

const ResultItem = () => {

  const { id } = useParams();
  const results = useSelector(selectAllResultes);
  const result = useSelector((state: RootState) => selectResultById(state, id || ""));
  const student = useSelector((state: RootState) => selectStudentById(state, result?.student));
  const interview = useSelector((state: RootState) => selectInterviewById(state, result?.interview));
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()

  const deleteResult = async () => {
    const data = await service.deleteRequest<undefined>("result/" + result._id);

    if (data instanceof ErrorMessage && result) {
      errorToast(data.message)
    } else {
      const newResults = results.filter(result => result.interview != id);
      successToast("Result deleted.")
      dispatch(resultsRecieved(newResults))
      dispatch(resultDeleted(result._id))
      navigate("/dash/result")
    }

  };

  const populatedResult: ResultPopulated = { ...result, student, interview }


  if (!result || !student || !interview) {
    return (
      <div>
        <h1>Something went wrong</h1>
        <Link to={"/dash/result"} >Result List</Link>
      </div>
    )
  }

  return (
    <div className="w-full m-8">


      <section className="m-auto w-fit p-8 bg-slate-50 shadow-xl">
        <h1 className="mb-8 text-xl flex justify-between">
          <span>Result</span>
          <span className="flex gap-2 items-center">
            <Link to={"/dash/result/edit/" + populatedResult._id}><MdEdit /></Link>
            <button onClick={deleteResult}><MdDeleteForever /></button>
          </span>
        </h1>
        <table>
          <tbody>
            <tr>
              <td className="text-right">Result ID: </td>
              <td className="pl-4">{populatedResult._id}</td>
            </tr>
            <tr>
              <td className="text-right">Company : </td>
              <td className="pl-4">{populatedResult.interview.companyName}</td>
            </tr>
            <tr>
              <td className="text-right">Interview ID : </td>
              <td className="pl-4">{populatedResult.interview._id}</td>
            </tr>
            <tr>
              <td className="text-right">Interview Date : </td>
              <td className="pl-4">{format(new Date(populatedResult.interview.date), "dd MMM yyyy")}</td>
            </tr>
            <tr>
              <td className="text-right">Student : </td>
              <td className="pl-4">{populatedResult.student.name}</td>
            </tr>
            <tr>
              <td className="text-right">Student ID: </td>
              <td className="pl-4">{populatedResult.student._id}</td>
            </tr>
            <tr>
              <td className="text-right">Status: </td>
              <td className="pl-4">{populatedResult.status}</td>
            </tr>
            <tr>
              <td className="text-right">CreatedAt : </td>
              <td className="pl-4">{format(new Date(result.createdAt), "dd MMM yyyy hh:mm:ss a")}</td>
            </tr>
            <tr>
              <td className="text-right">UpdatedAt : </td>
              <td className="pl-4">{format(new Date(result.updatedAt), "dd MMM yyyy hh:mm:ss a")}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default ResultItem;