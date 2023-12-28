import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { AppDispatch, RootState } from "../../app/store";
import { interviewDeleted, selectInterviewById } from "./interviewSlice";
import { format } from "date-fns"
import { MdDeleteForever, MdEdit } from "react-icons/md";
import service from "../../app/service";
import { ErrorMessage } from "../../models/Error";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { errorToast, successToast } from "../../util/toast";

const InterviewItem = () => {

  const { id } = useParams();
  const interview = useSelector((state: RootState) => selectInterviewById(state, id || ""));
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()

  const deleteInterview = async () => {
    const data = await service.deleteRequest<undefined>("interview/" + interview._id);
    
    if (data instanceof ErrorMessage && interview) {
        errorToast(data.message)
    } else {
      successToast(`interview for ${interview.companyName} deleted.`)
        dispatch(interviewDeleted(interview._id))
        navigate("/dash/interview")
    }

};


  if (!interview) {
    return (
      <div>
        <h1>Unable to find required interview</h1>
        <Link to={"/dash/interview"} >Interview List</Link>
      </div>
    )
  }

  return (
    <div className="w-full m-8">


      <section className="m-auto w-fit p-8 bg-slate-50 shadow-xl">
        <h1 className="mb-8 text-xl flex justify-between">
          <span>Interview</span>
          <span className="flex gap-2 items-center">
            <Link to={"/dash/interview/edit/" + interview._id}><MdEdit /></Link>
            <button onClick={deleteInterview}><MdDeleteForever /></button>
          </span>
        </h1>
        <table>
          <tbody>
            <tr>
              <td className="text-right">Company : </td>
              <td className="pl-4">{interview.companyName}</td>
            </tr>
            <tr>
              <td className="text-right">Interview ID : </td>
              <td className="pl-4">{interview._id}</td>
            </tr>
            <tr>
              <td className="text-right">Interview Date : </td>
              <td className="pl-4">{format(new Date(interview.date), "dd MMM yyyy")}</td>
            </tr>
            <tr>
              <td className="text-right">CreatedAt : </td>
              <td className="pl-4">{format(new Date(interview.createdAt), "dd MMM yyyy hh:mm:ss a")}</td>
            </tr>
            <tr>
              <td className="text-right">UpdatedAt : </td>
              <td className="pl-4">{format(new Date(interview.updatedAt), "dd MMM yyyy hh:mm:ss a")}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default InterviewItem;