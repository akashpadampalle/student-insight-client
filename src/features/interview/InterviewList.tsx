import { useSelector } from "react-redux";
import { MdEdit, MdDeleteForever, MdPreview, MdRefresh } from "react-icons/md"
import { selectAllInterviews, selectInterviewLoading, interviewAdded, interviewDeleted, interviewLoadingChanged, interviewsRecieved } from "./interviewSlice";
import Loading from "../../components/Loading";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { ErrorMessage } from "../../models/Error";
import { useState } from "react";
import service from "../../app/service";
import Interview from "../../models/Interview";
import { resultsRecieved, selectAllResultes } from "../result/resultSlice";
import { format } from "date-fns";
import { errorToast, successToast } from "../../util/toast";

const InterviewList = () => {
    const loading = useSelector(selectInterviewLoading);
    const [error, setError] = useState<ErrorMessage>()
    const interviews = useSelector(selectAllInterviews);
    const results = useSelector(selectAllResultes)
    const dispatch = useDispatch<AppDispatch>();


    const fetchInterviews = async () => {

        dispatch(interviewLoadingChanged(true))

        setError(undefined)

        const data = await service.getRequest<Interview[]>("interview")

        if (data instanceof ErrorMessage) {
            setError(data)
        } else {
            dispatch(interviewsRecieved(data))
        }

        dispatch(interviewLoadingChanged(false))

    };

    const deleteInterview = async (id: string) => {
        const interview = interviews.find(({ _id }) => _id == id);
        dispatch(interviewDeleted(id));
        const data = await service.deleteRequest<undefined>("interview/" + id)

        if (data instanceof ErrorMessage && interview) {
            errorToast(data.message)
            dispatch(interviewAdded(interview))
        } else {
            successToast(`interview for ${interview?.companyName} deleted.`)
            const newResults = results.filter(result => result.interview != id);
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
                <button onClick={fetchInterviews} className="flex items-center justify-center gap-2 bg-gray-300 shadow-2xl z-50 p-2 rounded-full border-gray-400 border fixed bottom-5 right-5 "><MdRefresh /> <span>Refresh</span></button>
            </div>
        )
    }

    return (
        <div className="w-full m-8">
            <h1 className="py-2 text-2xl text-center mb-8">List of Interviews</h1>
            <table className="w-full shadow-2xl">
                <thead>
                    <tr className="bg-orange-400" >
                        <th className="w-2" >Sr.</th>
                        <th className=" border-gray-500 border-s ">Company Name</th>
                        <th className=" border-gray-500 border-s w-2">Date</th>
                        <th className=" border-gray-500 border-s w-2 px-1">Edit</th>
                        <th className=" border-gray-500 border-s w-2 px-1">Delete</th>
                        <th className=" border-gray-500 border-s w-2 px-1">View</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        interviews.map((interview, index) => (
                            <tr className="even:bg-gray-200 odd:bg-gray-100 text-center " key={interview._id}>
                                <td>{index + 1}</td>
                                <td className=" border-gray-300 border-s ">{interview.companyName}</td>
                                <td className=" border-gray-300 border-s px-2 whitespace-nowrap">{format(new Date(interview.date), "dd MMM yyy")}</td>
                                <td className=" border-gray-300 border-s hover:bg-yellow-100"> <Link to={"edit/" + interview._id} className="flex justify-center" ><MdEdit /></Link> </td>
                                <td className="border-gray-300 border-s hover:bg-red-200"> <button onClick={() => { deleteInterview(interview._id) }} className="flex w-full justify-center"  ><MdDeleteForever /></button> </td>
                                <td className="border-gray-300 border-s hover:bg-green-200"> <Link to={interview._id} className="flex justify-center" ><MdPreview /></Link> </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            <button onClick={fetchInterviews} className="flex items-center justify-center gap-2 bg-gray-300 shadow-2xl z-50 p-2 rounded-full border-gray-400 border fixed bottom-5 right-5"><MdRefresh /> <span>Refresh</span></button>

        </div>

    )
}

export default InterviewList