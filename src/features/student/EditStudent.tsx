import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { studentAdded, selectAllStudents, selectStudentById, studentUpdated } from "./studentSlice";
import Student from "../../models/Student";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import service from "../../app/service";
import { ErrorMessage } from "../../models/Error";
import { selectAllBatches } from "../batch/batchSlice";
import { statusArray } from "../../models/Student";
import { useParams, useNavigate } from "react-router-dom";
import { errorToast, successToast } from "../../util/toast";


const EditStudent = () => {

  const { id } = useParams();
  const navigator = useNavigate();
  const student = useSelector((state: RootState) => selectStudentById(state, id || ""));
  const [studentName, setStudentName] = useState<string>(student?.name);
  const [college, setCollege] = useState<string>(student?.college);
  const [batch, setBatch] = useState<string>(student?.batch || "");
  const [status, setStatus] = useState<string>(student?.status);
  const [dsaFinalScore, setDsaFinalScore] = useState<number>(student?.dsaFinalScore);
  const [webFinalScore, setWebFinalScore] = useState<number>(student?.webFinalScore);
  const [reactFinalScore, setReactFinalScore] = useState<number>(student?.reactFinalScore);
  const [isvalid, setIsvalid] = useState(true);
  const students = useSelector(selectAllStudents);
  const batches = useSelector(selectAllBatches);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const existingStudent = students.find(student => student.name == studentName);
    if (studentName && (!existingStudent || existingStudent._id == student._id)) {
      setIsvalid(true);
    } else {
      setIsvalid(false);
    }
  }, [studentName, students]);

  const onStudentNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStudentName(event.target.value);
  };

  const onCollegeChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCollege(event.target.value);
  };

  const onDsaFinalScoreChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const value = Number(event.target.value);
      setDsaFinalScore(value);
    } catch (error) {
      setDsaFinalScore(0)
    }
  };

  const onWebFinalScoreChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const value = Number(event.target.value);
      setWebFinalScore(value);
    } catch (error) {
      setWebFinalScore(0)
    }  
  };

  const onReactFinalScoreChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const value = Number(event.target.value);
      setReactFinalScore(value);
    } catch (error) {
      setReactFinalScore(0)
    }
  };

  const onBatchChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBatch(event.target.value);
  };

  const onStatusChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(event.target.value);
  };

  const updateStudent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const oldStudent = student;

    const name = studentName;

    const newStudent: Student = {...oldStudent, name, batch};

    if (college) {
      newStudent.college = college;
    }

    if (dsaFinalScore || dsaFinalScore == 0) {
      newStudent.dsaFinalScore = dsaFinalScore;
    }

    if (webFinalScore || webFinalScore == 0) {
      newStudent.webFinalScore = webFinalScore;
    }

    if (reactFinalScore || reactFinalScore == 0) {
      newStudent.reactFinalScore = reactFinalScore;
    }

    if (status && (status == "placed" || status == "not_placed")) {
      newStudent.status = status;
    }

    setStudentName("")
    setCollege("")
    setBatch("")
    setDsaFinalScore(0)
    setWebFinalScore(0)
    setReactFinalScore(0)
    setStatus("")

    dispatch(studentUpdated(newStudent));

    const data = await service.patchRequest<Student>("student", {...newStudent, id: oldStudent._id, createdAt: undefined, updatedAt: undefined});

    if (data instanceof ErrorMessage) {
      errorToast(data.message)
      dispatch(studentUpdated(oldStudent))
    } else {
      successToast(`${name} student updated.`)
      dispatch(studentAdded(data))
    }

  };


  if (!student) {
    navigator("/dash/student")
  }


  return (
    <div className="w-full">
      <h1 className="py-2 text-2xl text-center">Create A Student</h1>
      <form onSubmit={updateStudent}>
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
                <select id="batch" className="min-w-full text-center border-b border-gray-400 outline-none focus:outline-none" value={batch} onChange={onBatchChanged} >
                  <option value=""></option>
                  {batches.map((batch) => <option key={batch._id} value={batch._id}>{batch.name}</option>)}
                </select>
              </td>
            </tr>
            <tr className="text-center">
              <td className="py-4"><label htmlFor="status" className="px-2 whitespace-nowrap">Status :</label></td>
              <td className="py-4">
                <select id="status" className="min-w-full text-center border-b border-gray-400 outline-none focus:outline-none" value={status} onChange={onStatusChanged}>
                  <option value=""></option>
                  {statusArray.map((status, index) => <option key={index} value={status}>{status}</option>)}
                </select>
              </td>
            </tr>
            <tr className="text-center">
              <td className="py-4"><label htmlFor="dsaFinalScore" className="px-2 whitespace-nowrap"> DSA Final Score :</label></td>
              <td className="py-4"><input type="number" id="dsaFinalScore" className="text-center border-b border-gray-400 outline-none focus:outline-none" value={dsaFinalScore} onChange={onDsaFinalScoreChanged} placeholder="enter DSA score" autoComplete="off" /></td>
            </tr>
            <tr className="text-center">
              <td className="py-4"><label htmlFor="webFinalScore" className="px-2 whitespace-nowrap"> Web Final Score :</label></td>
              <td className="py-4"><input type="number" id="webFinalScore" className="text-center border-b border-gray-400 outline-none focus:outline-none" value={webFinalScore} onChange={onWebFinalScoreChanged} placeholder="enter Web development score" autoComplete="off" /></td>
            </tr>
            <tr className="text-center">
              <td className="py-4"><label htmlFor="reactFinalScore" className="px-2 whitespace-nowrap"> React Final Score :</label></td>
              <td className="py-4"><input type="number" id="reactFinalScore" className="text-center border-b border-gray-400 outline-none focus:outline-none" value={reactFinalScore} onChange={onReactFinalScoreChanged} placeholder="enter React score" autoComplete="off" /></td>
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

export default EditStudent; 