import { createSlice, createEntityAdapter, PayloadAction } from "@reduxjs/toolkit";
import Result from "../../models/Result";
import { RootState } from "../../app/store";

const resultAdapter = createEntityAdapter({
    selectId: (result: Result) => result._id 
});

const initialState = resultAdapter.getInitialState({
    loading: false
});

const resultSlice = createSlice({
    name: "result",
    initialState,
    reducers: {
        resultsRecieved: (state, action: PayloadAction<Result[]>) => {
            resultAdapter.setAll(state, action.payload)
        },
        resultAdded: (state, action: PayloadAction<Result>) => {
            resultAdapter.setOne(state, action.payload)
        },
        resultLoadingChanged: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
        resultDeleted: (state, action: PayloadAction<string>) => {
            resultAdapter.removeOne(state, action.payload)
        },
        resultUpdated: (state, action: PayloadAction<Result>) => {
            resultAdapter.upsertOne(state, action.payload);
        }
    }
});

export const selectResultLoading = (state: RootState) => state.resultReducer.loading;

export const {
    selectAll: selectAllResultes,
    selectById: selectResultById,
    selectEntities: selectResultEntities
} = resultAdapter.getSelectors<RootState>( state => state.resultReducer );

export const {
    resultsRecieved,
    resultAdded,
    resultLoadingChanged,
    resultDeleted,
    resultUpdated
} = resultSlice.actions;

export default resultSlice.reducer;