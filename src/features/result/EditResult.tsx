import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import {  resultUpdated, selectResultById } from "./resultSlice";
import Result, { Status, statusArray } from "../../models/Result";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import service from "../../app/service";
import { ErrorMessage } from "../../models/Error";
import { selectAllStudents } from "../student/studentSlice";
import { selectAllInterviews } from "../interview/interviewSlice";
import { useParams, useNavigate } from "react-router-dom";
import { errorToast, successToast } from "../../util/toast";


const EditResult = () => {

  const { id } = useParams();
  const result = useSelector((state: RootState) => selectResultById(state, id || ""));
  const navigator = useNavigate();
  const students = useSelector(selectAllStudents);
  const interviews = useSelector(selectAllInterviews);
  const [student, setStudent] = useState<string>(result?.student);
  const [interview, setInterview] = useState<string>(result?.interview);
  const [status, setStatus] = useState<Status>(result?.status)
  const [isvalid, setIsvalid] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (student && interview && status) {
      setIsvalid(true);
    } else {
      setIsvalid(false);
    }
  }, [student, interview, status]);

  const onStudentChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStudent(event.target.value);
  };

  const onInterviewChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setInterview(event.target.value);
  };

  const onStatusChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    if (value == "PASS" || value == "FAIL" || value == "On Hold" || value == "Didn’t Attempt") {
      setStatus(value);
    }

  };


  const updateResult = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const oldResult = result;

    const newResult: Result = { ...oldResult, student, interview, status };
    dispatch(resultUpdated(newResult));

    const updateResult = {id: oldResult._id, student, interview, status}

    setInterview("");
    setStudent("");


    const data = await service.patchRequest<Result>("result", updateResult);

    if (data instanceof ErrorMessage) {
      errorToast(data.message)
      dispatch(resultUpdated(oldResult))
    } else {
      successToast("Result updated.")
      dispatch(resultUpdated(data));
    }

  };


  if (!result) {
    navigator("/dash/result");
  }


  return (
    <div className="w-full">
      <h1 className="py-2 text-2xl text-center">Create A result</h1>
      <form onSubmit={updateResult}>
        <table className="m-auto mt-4 border ">
          <tbody >
            <tr className="text-center">
              <td className="py-4"><label htmlFor="student" className="px-2 whitespace-nowrap">Student :</label></td>
              <td className="py-4">
                <select id="student" className="min-w-full text-center border-b border-gray-400 outline-none focus:outline-none" value={student} onChange={onStudentChanged} >
                  <option value=""></option>
                  {students.map((student) => <option key={student._id} value={student._id}>{student.name}</option>)}
                </select>
              </td>
            </tr>
            <tr className="text-center">
              <td className="py-4"><label htmlFor="interview" className="px-2 whitespace-nowrap">Interview :</label></td>
              <td className="py-4">
                <select id="interview" className="min-w-full text-center border-b border-gray-400 outline-none focus:outline-none" value={interview} onChange={onInterviewChanged} >
                  <option value=""></option>
                  {interviews.map((interview) => <option key={interview._id} value={interview._id}>{`${interview.companyName} - [${new Date(interview.date).toLocaleDateString()}]`}</option>)}
                </select>
              </td>
            </tr>
            <tr className="text-center">
              <td className="py-4"><label htmlFor="status" className="px-2 whitespace-nowrap">Status :</label></td>
              <td className="py-4">
                <select id="status" className=" min-w-full text-center border-b border-gray-400 outline-none focus:outline-none" value={status} onChange={onStatusChanged} >
                  <option value=""></option>
                  {statusArray.map((status, index) => <option key={index} value={status}>{status}</option>)}
                </select>
              </td>
            </tr>
            <tr className="text-center">
              <td colSpan={2} className={(isvalid) ? "bg-green-300 hover:shadow hover:bg-green-400" : "bg-gray-500"}>
                <input type="submit" value="Submit" disabled={!isvalid} />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  )
}

export default EditResult