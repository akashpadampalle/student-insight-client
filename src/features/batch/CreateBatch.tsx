import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { batchAdded, batchDeleted, selectAllBatches } from "./batchSlice";
import { nanoid } from "@reduxjs/toolkit";
import Batch from "../../models/Batch";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import service from "../../app/service";
import { ErrorMessage } from "../../models/Error";
import { errorToast, successToast } from "../../util/toast";


const CreateBatch = () => {

  const [batchName, setBatchName] = useState<string>("");
  const [isvalid, setIsvalid] = useState(true);
  const batches = useSelector(selectAllBatches);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const existingBatch = batches.find(batch => batch.name == batchName);
    if (batchName && !existingBatch) {
      setIsvalid(true);
    } else {
      setIsvalid(false);
    }
  }, [batchName]);

  const onBatchNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBatchName(event.target.value);
  };

  const createBatch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();
    const _id = nanoid();
    const name = batchName;

    setBatchName("")

    const newBatch: Batch = { _id, name, createdAt, updatedAt };

    dispatch(batchAdded(newBatch));

    const data = await service.postRequest<Batch>("batch", { name });

    dispatch(batchDeleted(_id));

    if (data instanceof ErrorMessage) {
      errorToast(data.message);
    } else {
      dispatch(batchAdded(data));
      successToast(`${name} batch create.`);
    }



  };


  return (
    <div className="w-full">
      <h1 className="py-2 text-2xl text-center">Create A Batch</h1>
      <form onSubmit={createBatch}>
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

export default CreateBatch