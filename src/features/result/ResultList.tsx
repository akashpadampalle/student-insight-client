import { useSelector } from "react-redux"
import { resultAdded, resultDeleted, resultLoadingChanged, resultsRecieved, selectAllResultes, selectResultLoading } from "./resultSlice"
import { useState } from "react"
import { ErrorMessage } from "../../models/Error"
import Loading from "../../components/Loading"
import { MdDeleteForever, MdEdit, MdPreview, MdRefresh } from "react-icons/md"
import { FaFileCsv } from "react-icons/fa"
import Result, { ResultPopulated } from "../../models/Result"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../app/store"
import service from "../../app/service"
import { selectStudentById } from "../student/studentSlice"
import { RootState } from "../../app/store"
import { selectInterviewById } from "../interview/interviewSlice"
import { Link } from "react-router-dom"
import { errorToast, successToast } from "../../util/toast"

interface ResultRowProps {
  result: Result,
  deleteResult: (id: string) => Promise<void>,
  index: number
}

const ResultRow = ({ result, deleteResult, index }: ResultRowProps) => {

  const student = useSelector((state: RootState) => selectStudentById(state, result.student));
  const interview = useSelector((state: RootState) => selectInterviewById(state, result.interview));

  const populatedResult: ResultPopulated = { ...result, student, interview };


  if (!result || !student || !interview) {
    return (
      <tr className="even:bg-gray-200 odd:bg-gray-100 text-center "></tr>
    )
  }


  return (
    <tr className="even:bg-gray-200 odd:bg-gray-100 text-center " key={populatedResult._id}>
      <td >{index + 1}</td>
      <td className=" border-gray-300 border-s ">{populatedResult.student.name}</td>
      <td className=" border-gray-300 border-s">{populatedResult.interview.companyName}</td>
      <td className="border-gray-300 border-s whitespace-nowrap px-2">{populatedResult.status}</td>
      <td className=" border-gray-300 border-s hover:bg-yellow-100"> <Link to={"edit/" + populatedResult._id} className="flex justify-center" ><MdEdit /></Link> </td>
      <td className="border-gray-300 border-s hover:bg-red-200"> <button onClick={() => { deleteResult(populatedResult._id) }} className="flex w-full justify-center"  ><MdDeleteForever /></button> </td>
      <td className="border-gray-300 border-s hover:bg-green-200"> <Link to={populatedResult._id} className="flex justify-center" ><MdPreview /></Link> </td>
    </tr>
  )
}


const ResultList = () => {

  const loading = useSelector(selectResultLoading);
  const results = useSelector(selectAllResultes);
  const [error, setError] = useState<ErrorMessage>();
  const dispatch = useDispatch<AppDispatch>();


  const fetchResults = async () => {
    setError(undefined);
    dispatch(resultLoadingChanged(true));
    const data = await service.getRequest<Result[]>("result");

    if (data instanceof ErrorMessage) {
      errorToast(data.message);
      setError(data);
    } else {
      successToast("Results fetched");
      dispatch(resultsRecieved(data));
      setError(undefined);
    }

    dispatch(resultLoadingChanged(false));
  }

  const deleteResult = async (id: string) => {
    const result = results.find(({ _id }) => _id == id);
    dispatch(resultDeleted(id));
    const data = await service.deleteRequest<undefined>("result/" + id);

    if (data instanceof ErrorMessage && result) {
      errorToast(data.message);
      dispatch(resultAdded(result));
    } else {
      successToast("Result deleted.")
    }
  };

  const downloadCSV = async () => {
    const data = await service.getRequest<"string">("/result/csv");
    if (data instanceof ErrorMessage) {
      errorToast(data.message);
    } else {
      const blob = new Blob([data], { type: 'text/csv' });

      // Create a download link
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'results.csv';

      // Append the link to the document
      document.body.appendChild(link);

      // Trigger a click on the link to initiate the download
      link.click();

      // Remove the link after the download
      document.body.removeChild(link);
      successToast("CSV file downloaded");
    }
  }

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
            <button onClick={fetchResults} className="flex items-center justify-center gap-2 bg-gray-300 shadow-2xl z-50 p-2 rounded-full border-gray-400 border fixed bottom-5 right-5 "><MdRefresh /> <span>Refresh</span></button>
        </div>
    )
}

  if (!results || !results.length) {
    return (
      <div className="flex w-full justify-center items-center">
        <span className="text-gray-400 text-2xl font-semibold">No Results Found</span>
      </div>
    )
  }

  return (
    <div className="w-full m-8">
      <h1 className="py-2 text-2xl text-center mb-8">List of Results</h1>
      <button onClick={downloadCSV} className="flex gap-2 justify-center items-center m-auto mb-8 rounded-lg shadow-xl p-2 bg-green-400 hover:bg-green-600 hover:shadow-2xl">
        <span>Download CSV</span>
        <FaFileCsv />
      </button>
      <table className="w-full shadow-2xl">
        <thead>
          <tr className="bg-green-400" >
            <th className="w-2">Sr.</th>
            <th className=" border-gray-500 border-s ">Student</th>
            <th className=" border-gray-500 border-s ">Company</th>
            <th className=" border-gray-500 border-s w-2 px-2">Status</th>
            <th className=" border-gray-500 border-s w-2 px-1">Edit</th>
            <th className=" border-gray-500 border-s w-2 px-1">Delete</th>
            <th className=" border-gray-500 border-s w-2 px-1">View</th>
          </tr>
        </thead>
        <tbody>
          {
            results.map(
              (result, index) => (
                <ResultRow
                  key={result._id}
                  result={result}
                  deleteResult={deleteResult}
                  index={index}
                />
              )
            )
          }
        </tbody>
      </table>
      <button onClick={fetchResults} className="flex items-center justify-center gap-2 bg-gray-300 shadow-2xl z-50 p-2 rounded-full border-gray-400 border fixed bottom-5 right-5"><MdRefresh /> <span>Refresh</span></button>
    </div>
  )
}

export default ResultList