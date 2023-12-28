import { configureStore } from "@reduxjs/toolkit";
import studentReducer from "../features/student/studentSlice";
import batchReducer from "../features/batch/batchSlice";
import interviewReducer from "../features/interview/interviewSlice";
import resultReducer from "../features/result/resultSlice";
import authReducer from "../features/authentication/authSlice";
import userReducer from "../features/user/userSlice";

const store = configureStore({
    reducer: {
        studentReducer,
        batchReducer,
        interviewReducer,
        resultReducer,
        authReducer,
        userReducer
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store;