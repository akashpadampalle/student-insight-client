import { Outlet } from "react-router-dom";
import DashAside from "./DashAside";
import DashHeader from "./DashHeader";
import DashFooter from "./DashFooter";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";
import { studentsRecieved } from "../features/student/studentSlice";
import { batchesRecieved } from "../features/batch/batchSlice";
import { interviewsRecieved } from "../features/interview/interviewSlice";
import { resultsRecieved } from "../features/result/resultSlice";
import service from "../app/service";
import { ErrorMessage } from "../models/Error";
import State from "../models/State";


const DashLayout = () => {

    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ErrorMessage>()
    const [aside, setAside] = useState<boolean>(false);

    useEffect(() => {
        const fetchState = async () => {
            setLoading(true);
            setError(undefined)
            const data = await service.getRequest<State>("state");

            if (data instanceof ErrorMessage) {
                setError(data);
            } else {
                dispatch(batchesRecieved(data.batches));
                dispatch(studentsRecieved(data.students));
                dispatch(interviewsRecieved(data.interviews));
                dispatch(resultsRecieved(data.results));
            }

            setLoading(false);
        }
        fetchState();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center w-screen h-screen ">
                <Loading />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-xl text-red-400 font-semibold text-center">
                {error.message}
            </div>
        )
    }

    const toggleAside = (): void => {
        setAside(!aside);
    }

    return (
        <div>
            <DashHeader toggleAside={toggleAside} aside={aside}/>

            <main className="min-h-screen flex">
                {aside && <DashAside />}
                <Outlet />
            </main>

            <DashFooter />
        </div>
    );
};


export default DashLayout;