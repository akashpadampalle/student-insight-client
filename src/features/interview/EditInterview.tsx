import React, { useEffect, useState } from "react"
import { interviewAdded, interviewUpdated, selectInterviewById } from "./interviewSlice";
import Interview from "../../models/Interview";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import service from "../../app/service";
import { ErrorMessage } from "../../models/Error";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { errorToast, successToast } from "../../util/toast";


const EditInterview = () => {

  const { id } = useParams();
  const interview = useSelector(((state: RootState) => selectInterviewById(state, id || "")))
  const navigator = useNavigate();
  const [companyName, setCompnayName] = useState<string>(interview?.companyName);
  const [date, setDate] = useState<Date>();
  const [isvalid, setIsvalid] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (companyName && date instanceof Date) {
      setIsvalid(true);
    } else {
      setIsvalid(false);
    }
  }, [companyName, date?.toISOString()]);

  const onCompnayNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCompnayName(event.target.value);
  };

  const onDateChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(event.target.value)
    setDate(date);
  };

  const updateInterview = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const oldInterview = interview;
    const dateString: string = date?.toISOString() || new Date().toISOString();
    const newInterview: Interview = { ...interview, companyName, date: dateString };

    setCompnayName("")
    setDate(undefined)


    dispatch(interviewUpdated(newInterview));

    const data = await service.patchRequest<Interview>("interview", { id: oldInterview._id, companyName, date });

    if (data instanceof ErrorMessage) {
      errorToast(data.message)
      dispatch(interviewUpdated(oldInterview))
    } else {
      successToast(`interview for ${interview.companyName} updated.`)
      dispatch(interviewAdded(data))
    }



  };

  if (!interview) {
    navigator("/dash/interview")
  }

  return (
    <div className="w-full">
      <h1 className="py-2 text-2xl text-center">Create A Interview</h1>
      <form onSubmit={updateInterview}>
        <table className="m-auto mt-4 border ">
          <tbody >
            <tr className="text-center">
              <td className="py-4"><label htmlFor="name" className="px-2 whitespace-nowrap">Interview Name :</label></td>
              <td className="py-4"><input type="text" id="name" className="text-center border-b border-gray-400 outline-none focus:outline-none" placeholder="enter interview name" value={companyName} onChange={onCompnayNameChanged} autoComplete="off" /></td>
            </tr>
            <tr className="text-center">
              <td className="py-4"><label htmlFor="date" className="px-2 whitespace-nowrap">Interview Name :</label></td>
              <td className="py-4"><input type="date" id="date" className="min-w-full text-center border-b border-gray-400 outline-none focus:outline-none" placeholder="enter interview name" onChange={onDateChanged} autoComplete="off" /></td>
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

export default EditInterview;