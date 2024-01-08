/*
  if you are using localhost to develop and test this project please setup https

                          username: admin
                          password: admin


*/

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Welcome from "./features/authentication/Welcome";
import Login from "./features/authentication/Login";
import DashLayout from "./components/DashLayout";
import StudentList from "./features/student/StudentList";
import CreateStudent from "./features/student/CreateStudent";
import BatchList from "./features/batch/BatchList";
import CreateBatch from "./features/batch/CreateBatch";
import InterviewList from "./features/interview/InterviewList";
import CreateInterview from "./features/interview/CreateInterview";
import ResultList from "./features/result/ResultList";
import CreateResult from "./features/result/CreateResult";
import { Provider } from "react-redux";
import store from "./app/store";
import EditResult from "./features/result/EditResult";
import EditStudent from "./features/student/EditStudent";
import EditBatch from "./features/batch/EditBatch";
import EditInterview from "./features/interview/EditInterview";
import StudentItem from "./features/student/StudentItem";
import BatchItem from "./features/batch/BatchItem";
import InterviewItem from "./features/interview/InterviewItem";
import ResultItem from "./features/result/ResultItem";
import ProtectedRoute from "./features/authentication/ProtectedRoute";
import UserList from "./features/user/UserList";
import CreateUser from "./features/user/CreateUser";
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";


const router = createBrowserRouter([
  { path: "/", element: <Welcome /> },
  { path: "/login", element: <Login /> },
  {
    path: "/dash", element: <ProtectedRoute> <DashLayout /> </ProtectedRoute>, children: [

      { index: true, element: <StudentList /> },

      {
        path: "student", children: [
          { index: true, element: <StudentList /> },
          { path: "create", element: <CreateStudent /> },
          { path: ":id", element: <StudentItem /> },
          { path: "edit/:id", element: <EditStudent /> },
        ]
      },

      {
        path: "batch", children: [
          { index: true, element: <BatchList /> },
          { path: "create", element: <CreateBatch /> },
          { path: ":id", element: <BatchItem /> },
          { path: "edit/:id", element: <EditBatch /> },
        ]
      },

      {
        path: "interview", children: [
          { index: true, element: <InterviewList /> },
          { path: "create", element: <CreateInterview /> },
          { path: ":id", element: <InterviewItem /> },
          { path: "edit/:id", element: <EditInterview /> },
        ]
      },

      {
        path: "result", children: [
          { index: true, element: <ResultList /> },
          { path: "create", element: <CreateResult /> },
          { path: ":id", element: <ResultItem /> },
          { path: "edit/:id", element: <EditResult /> },
        ]
      },
      {
        path: "user", children: [
          { index: true, element: <UserList /> },
          { path: "create", element: <CreateUser /> },
        ]
      },
    ]
  }
])

function App() {

  return (

    <Provider store={store} >
      <ToastContainer />
      <RouterProvider router={router} />
    </Provider>
  )
}

export default App
