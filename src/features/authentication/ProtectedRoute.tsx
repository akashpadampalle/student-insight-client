import { useEffect, ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import service from "../../app/service";
import { RefreshResponse } from "../../models/Token";
import { ErrorMessage } from "../../models/Error";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { login, selectUser } from "./authSlice";
import Loading from "../../components/Loading";
import { useSelector } from "react-redux";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const [loading, setLoading] = useState(true);
    const [error, seterror] = useState<ErrorMessage>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const user = useSelector(selectUser);

    useEffect(() => {

        (async () => {
            setLoading(true)
            seterror(undefined)
            try {
                const data = await service.getRequest<RefreshResponse>('/refresh');
                setLoading(false)
                if (data instanceof ErrorMessage) {
                    seterror(data);
                } else {
                    dispatch(login(data))
                }
            } catch (error) {
                navigate('/login');
            }
        })();

    }, []);

    useEffect(() => {

        if (!user) {
            const id = setTimeout(() => {
                navigate('/login')
            }, 5000);

            return () => clearTimeout(id);
        }

    })

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

    return user ? <>{children}</> : null
};

export default ProtectedRoute;
