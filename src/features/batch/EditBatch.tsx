import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { batchUpdated, selectAllBatches, selectBatchById } from "./batchSlice";
import Batch from "../../models/Batch";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import service from "../../app/service";
import { ErrorMessage } from "../../models/Error";
import { useParams, useNavigate } from "react-router-dom";
import { errorToast, successToast } from "../../util/toast";

const EditBatch = () => {

  const { id } = useParams();
  const navigator = useNavigate();
  const batch = useSelector((state: RootState) => selectBatchById(state, id || ""))
  const [batchName, setBatchName] = useState<string>(batch?.name);
  const [isvalid, setIsvalid] = useState(true);
  const batches = useSelector(selectAllBatches);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const existingBatch = batches.find(batch => batch.name == batchName);
    if (batchName && (!existingBatch || existingBatch._id == batch._id)) {
      setIsvalid(true);
    } else {
      setIsvalid(false);
    }
  }, [batchName]);

  const onBatchNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBatchName(event.target.value);
  };

  const updateBatch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const oldBatch = batch;

    const name = batchName

    setBatchName("")

    const newBatch: Batch = { ...batch, name};

    dispatch(batchUpdated(newBatch));

    const data = await service.patchRequest<Batch>("batch", { id: oldBatch._id, name });

    if (data instanceof ErrorMessage) {
      errorToast(data.message)
      dispatch(batchUpdated(oldBatch));
    } else {
      successToast(`${name} batch updated.`)
      dispatch(batchUpdated(data));
    }

  };


  if (!batch) {
    navigator("/dash/batch");
  }


  return (
    <div className="w-full">
      <h1 className="py-2 text-2xl text-center">Create A Batch</h1>
      <form onSubmit={updateBatch}>
        <table className="m-auto mt-4 border ">
          <tbody >
            <tr className="text-center">
              <td className="py-4"><label htmlFor="name" className="px-2 whitespace-nowrap">Batch Name :</label></td>
              <td className="py-4"><input type="text" id="name" className="text-center border-b border-gray-400 outline-none focus:outline-none" placeholder="enter batch name" value={batchName} onChange={onBatchNameChanged} autoComplete="off" /></td>
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

export default EditBatch