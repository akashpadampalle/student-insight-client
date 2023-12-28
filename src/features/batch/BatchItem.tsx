import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { AppDispatch, RootState } from "../../app/store";
import { batchDeleted, selectBatchById } from "./batchSlice";
import { format } from "date-fns"
import { MdDeleteForever, MdEdit } from "react-icons/md";
import service from "../../app/service";
import { ErrorMessage } from "../../models/Error";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { errorToast, successToast } from "../../util/toast";

const BatchItem = () => {

  const { id } = useParams();
  const batch = useSelector((state: RootState) => selectBatchById(state, id || ""));
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()

  const deleteBatch = async () => {
    const data = await service.deleteRequest<undefined>("batch/" + batch._id);
    
    if (data instanceof ErrorMessage && batch) {
        errorToast(data.message);
    } else {
        dispatch(batchDeleted(batch._id));
        navigate("/dash/batch")
        successToast(`${batch.name} batch deleted.`)
    }

};


  if (!batch) {
    return (
      <div>
        <h1 className="text-gray-400 text-center text-xl">Unable to find batch</h1>
        <Link to={"/dash/batch"} >Batch List</Link>
      </div>
    )
  }

  return (
    <div className="w-full m-8">


      <section className="m-auto w-fit p-8 bg-slate-50 shadow-xl">
        <h1 className="mb-8 text-xl flex justify-between">
          <span>{batch.name}</span>
          <span className="flex gap-2 items-center">
            <Link to={"/dash/batch/edit/" + batch._id}><MdEdit /></Link>
            <button onClick={deleteBatch}><MdDeleteForever /></button>
          </span>
        </h1>
        <table>
          <tbody>
            <tr>
              <td className="text-right">Batch Name : </td>
              <td className="pl-4">{batch.name}</td>
            </tr>
            <tr>
              <td className="text-right">Batch ID : </td>
              <td className="pl-4">{batch._id}</td>
            </tr>
            <tr>
              <td className="text-right">CreatedAt : </td>
              <td className="pl-4">{format(new Date(batch.createdAt), "dd MMM yyyy hh:mm:ss a")}</td>
            </tr>
            <tr>
              <td className="text-right">UpdatedAt : </td>
              <td className="pl-4">{format(new Date(batch.updatedAt), "dd MMM yyyy hh:mm:ss a")}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default BatchItem;