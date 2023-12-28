import { createSlice, createEntityAdapter, PayloadAction } from "@reduxjs/toolkit";
import Interview from "../../models/Interview";
import { RootState } from "../../app/store";

const interviewAdapter = createEntityAdapter({
    selectId: (interview: Interview) => interview._id 
});

const initialState = interviewAdapter.getInitialState({
    loading: false
});

const interviewSlice = createSlice({
    name: "interview",
    initialState,
    reducers: {
        interviewsRecieved: (state, action: PayloadAction<Interview[]>) => {
            interviewAdapter.setAll(state, action.payload)
        },
        interviewAdded: (state, action: PayloadAction<Interview>) => {
            interviewAdapter.setOne(state, action.payload)
        },
        interviewLoadingChanged: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
        interviewDeleted: (state, action: PayloadAction<string>) => {
            interviewAdapter.removeOne(state, action.payload)
        }, 
        interviewUpdated: (state, action: PayloadAction<Interview>) => {
            interviewAdapter.upsertOne(state, action.payload)
        }
    }
});

export const selectInterviewLoading = (state: RootState) => state.interviewReducer.loading;

export const {
    selectAll: selectAllInterviews,
    selectById: selectInterviewById,
    selectEntities: selectInterviewEntities
} = interviewAdapter.getSelectors<RootState>( state => state.interviewReducer );

export const {
    interviewsRecieved,
    interviewAdded,
    interviewLoadingChanged,
    interviewDeleted,
    interviewUpdated
} = interviewSlice.actions;

export default interviewSlice.reducer;