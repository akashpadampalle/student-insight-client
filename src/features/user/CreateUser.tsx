import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { userAdded, userDeleted, selectAllUsers } from "./userSlice";
import { nanoid } from "@reduxjs/toolkit";
import User from "../../models/User";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import service from "../../app/service";
import { ErrorMessage } from "../../models/Error";
import { errorToast, successToast } from "../../util/toast";


const CreateUser = () => {

    const [userName, setUserName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isvalid, setIsvalid] = useState(true);
    const users = useSelector(selectAllUsers);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const existingUser = users.find(user => user.username == userName);
        if (userName && !existingUser) {
            setIsvalid(true);
        } else {
            setIsvalid(false);
        }
    }, [userName, users]);

    const onUserNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserName(event.target.value);
    };


    const onPasswordChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };


    const createUser = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const _id = nanoid();
        const username = userName;
        const newPass = password
        const newUser: User = { _id, username: userName, type: "Employee" };

        setUserName("")
        setPassword("");
        dispatch(userAdded(newUser));
        const data = await service.postRequest<User>("user", { username, password: newPass });

        dispatch(userDeleted(_id))

        if (data instanceof ErrorMessage) {
            errorToast(data.message);
        } else {
            successToast(`student ${username} created`);
            dispatch(userAdded(data))
        }

    };


    return (
        <div className="w-full">
            <h1 className="py-2 text-2xl text-center">Create A User</h1>
            <form onSubmit={createUser}>
                <table className="m-auto mt-4 border ">
                    <tbody >
                        <tr className="text-center">
                            <td className="py-4"><label htmlFor="name" className="px-2 whitespace-nowrap">User Name :</label></td>
                            <td className="py-4"><input type="text" id="name" className="text-center border-b border-gray-400 outline-none focus:outline-none" placeholder="enter user name" value={userName} onChange={onUserNameChanged} autoComplete="off" /></td>
                        </tr>
                        <tr className="text-center">
                            <td className="py-4"><label htmlFor="password" className="px-2 whitespace-nowrap">password :</label></td>
                            <td className="py-4"><input type="password" id="password" className="text-center border-b border-gray-400 outline-none focus:outline-none" placeholder="enter password" value={password} onChange={onPasswordChanged} autoComplete="off" /></td>
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

export default CreateUser