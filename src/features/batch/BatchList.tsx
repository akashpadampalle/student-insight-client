import { useSelector } from "react-redux";
import { MdEdit, MdDeleteForever, MdPreview, MdRefresh } from "react-icons/md"
import { selectAllBatches, selectBatchLoading, batchAdded, batchDeleted, batchLoadingChanged, batchesRecieved } from "./batchSlice";
import Loading from "../../components/Loading";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { ErrorMessage } from "../../models/Error";
import { useState } from "react";
import service from "../../app/service";
import Batch from "../../models/Batch";
import { selectAllStudents, studentsRecieved } from "../student/studentSlice";
import { errorToast, successToast } from "../../util/toast";

const BatchList = () => {
    const loading = useSelector(selectBatchLoading);
    const [error, setError] = useState<ErrorMessage>()
    const batches = useSelector(selectAllBatches);
    const students = useSelector(selectAllStudents);
    const dispatch = useDispatch<AppDispatch>();


    const fetchBatches = async () => {

        dispatch(batchLoadingChanged(true));

        setError(undefined);

        const data = await service.getRequest<Batch[]>("batch");

        if (data instanceof ErrorMessage) {
            setError(data);
        } else {
            dispatch(batchesRecieved(data));
        }

        dispatch(batchLoadingChanged(false));

    };

    const deleteBatch = async (id: string) => {
        const batch = batches.find(({ _id }) => _id == id);
        dispatch(batchDeleted(id));
        const data = await service.deleteRequest<undefined>("batch/" + id);
        
        if (data instanceof ErrorMessage && batch) {
            dispatch(batchAdded(batch));
            errorToast(data.message);
        } else {
          const newStudents = students.map( student => ({...student, batch: null}));
          dispatch(studentsRecieved(newStudents));
          successToast(`${batch?.name} batch deleted.`);
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
                <button onClick={fetchBatches} className="flex items-center justify-center gap-2 bg-gray-300 shadow-2xl z-50 p-2 rounded-full border-gray-400 border fixed bottom-5 right-5 "><MdRefresh /> <span>Refresh</span></button>
            </div>
        )
    }

    return (
        <div className="w-full m-8">
            <h1 className="py-2 text-2xl text-center mb-8">List of Batchs</h1>
            <table className=" w-full shadow-2xl">
                <thead>
                    <tr className="bg-rose-400" >
                        <th className="w-2">Sr.</th>
                        <th className=" border-gray-500 border-s">Name</th>
                        <th className=" border-gray-500 border-s w-2 px-1">Edit</th>
                        <th className=" border-gray-500 border-s w-2 px-1">Delete</th>
                        <th className=" border-gray-500 border-s w-4 px-1">View</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        batches.map((batch, index) => (
                            <tr className="even:bg-gray-200 odd:bg-gray-100 text-center " key={batch._id}>
                                <td>{index + 1}</td>
                                <td className=" border-gray-300 border-s ">{batch.name}</td>
                                <td className=" border-gray-300 border-s hover:bg-yellow-100"> <Link to={"edit/" + batch._id} className="flex justify-center" ><MdEdit /></Link> </td>
                                <td className="border-gray-300 border-s hover:bg-red-200"> <button onClick={() => { deleteBatch(batch._id) }} className="flex w-full justify-center"  ><MdDeleteForever /></button> </td>
                                <td className="border-gray-300 border-s hover:bg-green-200"> <Link to={batch._id} className="flex justify-center" ><MdPreview /></Link> </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            <button onClick={fetchBatches} className="flex items-center justify-center gap-2 bg-gray-300 shadow-2xl z-50 p-2 rounded-full border-gray-400 border fixed bottom-5 right-5"><MdRefresh /> <span>Refresh</span></button>

        </div>

    )
}

export default BatchList