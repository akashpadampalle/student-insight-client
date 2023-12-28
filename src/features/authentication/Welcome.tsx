import background from "../../assets/bg.jpg";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-cover bg-center " style={{ backgroundImage: `url(${background})` }}>
      <div className="text-center text-gray-200">
        <p className="text-2xl">Welcome to <span className="text-rose-400 font-semibold">Students Insight</span></p>
        <p className="text-gray-400 font-light mb-8">This project is build as an coding ninjas full stack test.</p>
        <Link to={'/login'} className="bg-green-300 p-2 text-gray-700 font-semibold rounded shadow-2xl">Get Started</Link>
      </div>
    </div>
  )
}

export default Welcome