import * as Avatar from "@radix-ui/react-avatar";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdClose, MdLogout } from "react-icons/md";
import { useSelector } from "react-redux";
import { login, selectUser } from "../features/authentication/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";
import service from "../app/service";
import { useNavigate } from "react-router-dom";
import { successToast } from "../util/toast";

interface DashHeaderProps {
    toggleAside: () => void,
    aside: boolean,
}

const DashHeader = ({ toggleAside, aside }: DashHeaderProps) => {

    const user = useSelector(selectUser);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(login({accessToken: null, user: null}));
        service.getRequest("/logout");
        successToast(`bye bye ${user?.username}`)
        navigate("/");
    } 

    return (
        <nav className="shadow flex justify-between px-1 bg-gray-300">
            <button onClick={toggleAside} className="text-xl">{aside ? <MdClose /> : <RxHamburgerMenu />}</button>
            <div className="flex justify-center items-center gap-4">
                <span>{user?.username}</span>
                <Avatar.Root className="shadow m-1 inline-flex align-middle justify-center items-center w-8 h-8 overflow-hidden rounded-full">
                    <Avatar.Image className="w-full h-full object-cover" />
                    <Avatar.Fallback className="w-full h-full bg-slate-50 flex items-center justify-center font-medium text-xl">
                        {user?.username.substring(0, 2).toLocaleUpperCase()}
                    </Avatar.Fallback>
                </Avatar.Root>
                <button onClick={handleLogout}>
                    <MdLogout />
                </button>
            </div>
        </nav>
    )
}

export default DashHeader