import { createSlice, createEntityAdapter, PayloadAction } from "@reduxjs/toolkit";
import Student from "../../models/Student";
import { RootState } from "../../app/store";

const studentAdapter = createEntityAdapter({
    selectId: (student: Student) => student._id
})


const initialState = studentAdapter.getInitialState({
    loading: false
})

const studentSlice = createSlice({
    name: "students",
    initialState,
    reducers: {
        studentsRecieved: (state, action: PayloadAction<Student[]>) => {
            studentAdapter.setAll(state, action.payload)
        },
        studentAdded: (state, action: PayloadAction<Student>) => {
            studentAdapter.setOne(state, action.payload)
        },
        studentLoadingChanged: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
        studentDeleted: (state, action: PayloadAction<string>) => {
            studentAdapter.removeOne(state, action.payload)
        },
        studentUpdated: (state, action: PayloadAction<Student>) => {
            studentAdapter.upsertOne(state, action.payload)
        }
    }
})

export const selectStudentLoading = (state: RootState) => state.studentReducer.loading

export const {
    selectAll: selectAllStudents,
    selectById: selectStudentById,
    selectEntities: selectAllStudentEntities
} = studentAdapter.getSelectors<RootState>( state => state.studentReducer )


export const { 
    studentsRecieved,
    studentAdded,
    studentLoadingChanged,
    studentDeleted,
    studentUpdated
} = studentSlice.actions;

export default studentSlice.reducer;