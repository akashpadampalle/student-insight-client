import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { resultAdded, resultDeleted } from "./resultSlice";
import { nanoid } from "@reduxjs/toolkit";
import Result, { statusArray } from "../../models/Result";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import service from "../../app/service";
import { ErrorMessage } from "../../models/Error";
import { selectAllStudents } from "../student/studentSlice";
import { selectAllInterviews } from "../interview/interviewSlice";
import { errorToast, successToast } from "../../util/toast";



const CreateResult = () => {
  const students = useSelector(selectAllStudents);
  const interviews = useSelector(selectAllInterviews);
  const [student, setStudent] = useState<string>("");
  const [interview, setInterview] = useState<string>("");
  const [status, setStatus] = useState<string>("")
  const [isvalid, setIsvalid] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (student && interview) {
      setIsvalid(true);
    } else {
      setIsvalid(false);
    }
  }, [student, interview]);

  const onStudentChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStudent(event.target.value);
  };

  const onInterviewChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setInterview(event.target.value);
  };

  const onStatusChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(event.target.value);
  };


  const createresult = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();
    const _id = nanoid();
    const newresult: Result = { _id, student, status: "Didn’t Attempt", interview, createdAt, updatedAt };
    dispatch(resultAdded(newresult));

    let studentObj: { student: string, interview: string, status?: string };

    if (status && (statusArray.find(s => status == s))) {
      studentObj = { student, interview, status };
    } else {
      studentObj = { student, interview };
    }

    setStatus("");
    setInterview("");
    setStudent("");

    const data = await service.postRequest<Result>("result", studentObj);

    dispatch(resultDeleted(_id));

    if (data instanceof ErrorMessage) {
      errorToast(data.message);
    } else {
      successToast("Result added.");
      dispatch(resultAdded(data));
    }
  };


  return (
    <div className="w-full">
      <h1 className="py-2 text-2xl text-center">Create A result</h1>
      <form onSubmit={createresult}>
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

export default CreateResult