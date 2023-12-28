import * as Accordion from "@radix-ui/react-accordion";
import { PiStudentBold, PiCalendarDuotone, PiCheckSquareDuotone, PiUserListDuotone } from "react-icons/pi";
import { NavLink } from "react-router-dom";
import { selectUser } from "../features/authentication/authSlice";
import { useSelector } from "react-redux";

const DashAside = () => {

    const user = useSelector(selectUser);

    return (
        <aside className="min-w-fit flex flex-col items-center bg-gray-300 shadow">
            <Accordion.Root type="multiple" className="text-lg p-2">

                {
                    (user?.type != "Admin") ?
                        null :
                        (
                            <Accordion.Item value="user" className="rounded shadow bg-gray-400 pb-4 border-gray-400 mb-4">
                                <Accordion.Trigger className="flex gap-1 justify-center items-center p-4">
                                    <PiStudentBold /> <span> user Management </span>
                                </Accordion.Trigger>
                                <Accordion.Content className="flex flex-col justify-center items-center bg-gray-300 mx-2 rounded-lg shadow overflow-hidden">
                                    <NavLink to={"/dash/user"} className="flex w-full justify-around items-center bg-gray-200 hover:bg-gray-300 shadow"> List Users </NavLink>
                                    <NavLink to={"/dash/user/create"} className="flex w-full justify-around items-center bg-gray-200 hover:bg-gray-300 shadow" > Create User </NavLink>
                                </Accordion.Content>
                            </Accordion.Item>
                        )
                }




                <Accordion.Item value="student" className="rounded shadow bg-gray-400 pb-4 border-gray-400 mb-4">
                    <Accordion.Trigger className="flex gap-1 justify-center items-center p-4">
                        <PiStudentBold /> <span> Studnet Management </span>
                    </Accordion.Trigger>
                    <Accordion.Content className="flex flex-col justify-center items-center bg-gray-300 mx-2 rounded-lg shadow overflow-hidden">
                        <NavLink to={"/dash/student"} className="flex w-full justify-around items-center bg-gray-200 hover:bg-gray-300 shadow"> List Students </NavLink>
                        <NavLink to={"/dash/student/create"} className="flex w-full justify-around items-center bg-gray-200 hover:bg-gray-300 shadow" > Create Student </NavLink>
                    </Accordion.Content>
                </Accordion.Item>

                <Accordion.Item value="batch" className="rounded shadow bg-gray-400 pb-4 border-gray-400 mb-4">
                    <Accordion.Trigger className="flex gap-1 justify-center items-center p-4">
                        <PiUserListDuotone />
                        <span> Batch Management </span>
                    </Accordion.Trigger>
                    <Accordion.Content className="flex flex-col justify-center items-center bg-gray-300 mx-2 rounded-lg shadow overflow-hidden">
                        <NavLink to={"/dash/batch"} className="flex w-full justify-around items-center bg-gray-200 hover:bg-gray-300 shadow">  List Batch </NavLink>
                        <NavLink to={"/dash/batch/create"} className="flex w-full justify-around items-center bg-gray-200 hover:bg-gray-300 shadow" > Create Batch </NavLink>
                    </Accordion.Content>
                </Accordion.Item>

                <Accordion.Item value="interview" className="rounded shadow bg-gray-400 pb-4 border-gray-400 mb-4">
                    <Accordion.Trigger className="flex gap-1 justify-center items-center p-4">
                        <PiCalendarDuotone />
                        <span> Interview Management </span>
                    </Accordion.Trigger>
                    <Accordion.Content className="flex flex-col justify-center items-center bg-gray-300 mx-2 rounded-lg shadow overflow-hidden">
                        <NavLink to={"/dash/interview"} className="flex w-full justify-around items-center bg-gray-200 hover:bg-gray-300 shadow">  List Interview </NavLink>
                        <NavLink to={"/dash/interview/create"} className="flex w-full justify-around items-center bg-gray-200 hover:bg-gray-300 shadow" > Create Interview </NavLink>
                    </Accordion.Content>
                </Accordion.Item>

                <Accordion.Item value="result" className="rounded shadow bg-gray-400 pb-4 border-gray-400 mb-4">
                    <Accordion.Trigger className="flex gap-1 justify-center items-center p-4">
                        <PiCheckSquareDuotone />
                        <span> Result Management </span>
                    </Accordion.Trigger>
                    <Accordion.Content className="flex flex-col justify-center items-center bg-gray-300 mx-2 rounded-lg shadow overflow-hidden">
                        <NavLink to={"/dash/result"} className="flex w-full justify-around items-center bg-gray-200 hover:bg-gray-300 shadow">  List Result </NavLink>
                        <NavLink to={"/dash/result/create"} className="flex w-full justify-around items-center bg-gray-200 hover:bg-gray-300 shadow" > Create Result </NavLink>
                    </Accordion.Content>
                </Accordion.Item>

            </Accordion.Root>
        </aside>
    )
}

export default DashAside