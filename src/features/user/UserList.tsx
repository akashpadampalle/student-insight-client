import { useSelector } from "react-redux";
import { MdDeleteForever, MdRefresh } from "react-icons/md"
import { selectAllUsers, selectUserLoading, userAdded, userDeleted, userLoadingChanged, usersRecieved } from "./userSlice";
import Loading from "../../components/Loading";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { ErrorMessage } from "../../models/Error";
import { useEffect, useState } from "react";
import service from "../../app/service";
import User from "../../models/User";
import { selectUser } from "../authentication/authSlice";
import { errorToast, successToast } from "../../util/toast";


const UserList = () => {
    const loading = useSelector(selectUserLoading);
    const [error, setError] = useState<ErrorMessage>()
    const users = useSelector(selectAllUsers);
    const user = useSelector(selectUser);
    const dispatch = useDispatch<AppDispatch>();


    useEffect(() => {
        fetchUsers()
    }, []);

    const usersToRender = users.filter( u => u._id != user?._id);

    const fetchUsers = async () => {

        dispatch(userLoadingChanged(true))

        setError(undefined)

        const data = await service.getRequest<User[]>("user")

        if (data instanceof ErrorMessage) {
            errorToast(data.message);
            setError(data)
        } else {
            successToast("users fetched successfully.")
            dispatch(usersRecieved(data))
        }

        dispatch(userLoadingChanged(false))

    };

    const deleteUser = async (id: string) => {
        const user = users.find(({ _id }) => _id == id);
        dispatch(userDeleted(id));
        const data = await service.deleteRequest<undefined>("user/" + id);

        if (data instanceof ErrorMessage && user) {
            errorToast(data.message);
            dispatch(userAdded(user));
        } else {
            successToast(`${user?.username} deleted.`);
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
                <button onClick={fetchUsers} className="flex items-center justify-center gap-2 bg-gray-300 shadow-2xl z-50 p-2 rounded-full border-gray-400 border fixed bottom-5 right-5 "><MdRefresh /> <span>Refresh</span></button>
            </div>
        )
    }

    return (
        <div className="w-full m-8">
            <h1 className="py-2 text-2xl text-center mb-8">List of Users</h1>
            <table className="w-full shadow-2xl">
                <thead>
                    <tr className="bg-blue-400" >
                        <th className="w-2">Sr</th>
                        <th className=" border-gray-500 border-s ">Name</th>
                        <th className=" border-gray-500 border-s ">Type</th>
                        <th className=" border-gray-500 border-s w-2 px-1">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        usersToRender.map((user, index) => (
                            <tr className="even:bg-gray-200 odd:bg-gray-100 text-center " key={user._id}>
                                <td >{index + 1}</td>
                                <td className=" border-gray-300 border-s ">{user.username}</td>
                                <td className=" border-gray-300 border-s">{user.type}</td>
                                <td className="border-gray-300 border-s hover:bg-red-200"> <button onClick={() => { deleteUser(user._id) }} className="flex w-full justify-center"  ><MdDeleteForever /></button> </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            <button onClick={fetchUsers} className="flex items-center justify-center gap-2 bg-gray-300 shadow-2xl z-50 p-2 rounded-full border-gray-400 border fixed bottom-5 right-5"><MdRefresh /> <span>Refresh</span></button>

        </div>

    )
}

export default UserList