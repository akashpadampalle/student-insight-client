import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { studentAdded, studentDeleted, selectAllStudents } from "./studentSlice";
import { nanoid } from "@reduxjs/toolkit";
import Student from "../../models/Student";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import service from "../../app/service";
import { ErrorMessage } from "../../models/Error";
import { selectAllBatches } from "../batch/batchSlice";
import { errorToast, successToast } from "../../util/toast";


const CreateStudent = () => {

  const [studentName, setStudentName] = useState<string>("");
  const [college, setCollege] = useState<string>("");
  const [batch, setBatch] = useState<string>("");
  const [isvalid, setIsvalid] = useState(true);
  const students = useSelector(selectAllStudents);
  const batches = useSelector(selectAllBatches);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const existingStudent = students.find(student => student.name == studentName);
    if (studentName && !existingStudent && college && batch) {
      setIsvalid(true);
    } else {
      setIsvalid(false);
    }
  }, [studentName, students, college, batch]);

  const onStudentNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStudentName(event.target.value);
  };

  const onCollegeChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCollege(event.target.value);
  };

  const onBatchChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBatch(event.target.value);
  };


  const createStudent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();
    const _id = nanoid();
    const name = studentName;

    const newStudent: Student = { _id, name, college, batch, createdAt, updatedAt, status:"not_placed", dsaFinalScore: 0, webFinalScore: 0, reactFinalScore: 0 };
    
    setStudentName("")
    setCollege("")
    setBatch("")

    dispatch(studentAdded(newStudent));

    const data = await service.postRequest<Student>("student", { name, college, batch });

    dispatch(studentDeleted(_id))

    if (data instanceof ErrorMessage) {
      errorToast(data.message)
    } else {
      successToast(`${name} student added.`)
      dispatch(studentAdded(data))
    }
    
  };


  return (
    <div className="w-full">
      <h1 className="py-2 text-2xl text-center">Create A Student</h1>
      <form onSubmit={createStudent}>
        <table className="m-auto mt-4 border ">
          <tbody >
            <tr className="text-center">
              <td className="py-4"><label htmlFor="name" className="px-2 whitespace-nowrap">Student Name :</label></td>
              <td className="py-4"><input type="text" id="name" className="text-center border-b border-gray-400 outline-none focus:outline-none" placeholder="enter student name" value={studentName} onChange={onStudentNameChanged} autoComplete="off" /></td>
            </tr>
            <tr className="text-center">
              <td className="py-4"><label htmlFor="college" className="px-2 whitespace-nowrap">College Name :</label></td>
              <td className="py-4"><input type="text" id="college" className="text-center border-b border-gray-400 outline-none focus:outline-none" placeholder="enter student name" value={college} onChange={onCollegeChanged} autoComplete="off" /></td>
            </tr>
            <tr className="text-center">
              <td className="py-4"><label htmlFor="batch" className="px-2 whitespace-nowrap">Batch :</label></td>
              <td className="py-4">
                <select id="batch" className="min-w-full text-center border-b border-gray-400 outline-none focus:outline-none" value={batch}  onChange={onBatchChanged} >
                  <option value=""></option>
                  {batches.map((batch) => <option key={batch._id} value={batch._id}>{batch.name}</option>)}
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

export default CreateStudent