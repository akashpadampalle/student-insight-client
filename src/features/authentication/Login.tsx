import { useState } from "react"
import service from "../../app/service";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { ErrorMessage } from "../../models/Error";
import { AuthState, login } from "./authSlice";
import { useNavigate } from "react-router-dom";
import { errorToast, successToast } from "../../util/toast";

interface FormData {
  username: string
  password: string
}

const Login = () => {

  const [formData, setFormData] = useState<FormData>({ username: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()

  const isValid: Boolean = Boolean(formData.password && formData.username);

  const handleFormdataChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFormData: FormData = { ...formData, [event.target.name]: event.target.value }
    setFormData(newFormData)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const data = await service.postRequest<AuthState>('/login', formData);
    
    if (data instanceof ErrorMessage) {
      errorToast(data.message);
    } else {
      dispatch(login(data));
      successToast(`Welcome ${data.user?.username}`)
      setTimeout(() => navigate("/dash"), 500);
    }

    setLoading(false)
    
  }

  return (
    <div className="w-full">
      <h1 className="py-2 text-2xl text-center">Login</h1>
      <form onSubmit={ handleSubmit }>
        <table className="m-auto mt-4 border ">
          <tbody >
            <tr className="text-center">
              <td className="py-4"><label htmlFor="username" className="px-2 whitespace-nowrap"> Username :</label></td>
              <td className="py-4"><input type="text" name="username" id="username" className="text-center border-b border-gray-400 outline-none focus:outline-none" placeholder="enter username" value={formData.username} onChange={handleFormdataChanged} autoComplete="off" /></td>
            </tr>
            <tr className="text-center">
              <td className="py-4"><label htmlFor="password" className="px-2 whitespace-nowrap"> Password :</label></td>
              <td className="py-4"><input type="password" name="password" id="password" className="text-center border-b border-gray-400 outline-none focus:outline-none" placeholder="enter password" value={formData.password} onChange={handleFormdataChanged} autoComplete="off" /></td>
            </tr>
            <tr className="text-center">
              <td colSpan={2} className={(isValid) ? "bg-green-300 hover:shadow hover:bg-green-400" : "bg-gray-500"}>
                <input type="submit" value={`${(loading)? "Loading..." : "Submit" }`} disabled={!isValid} />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  )
}

export default Login