import { createSlice, createEntityAdapter, PayloadAction } from "@reduxjs/toolkit";
import Batch from "../../models/Batch";
import { RootState } from "../../app/store";

const batchAdapter = createEntityAdapter({
    selectId: (batch: Batch) => batch._id 
});

const initialState = batchAdapter.getInitialState({
    loading: false
});

const batchSlice = createSlice({
    name: "batch",
    initialState,
    reducers: {
        batchesRecieved: (state, action: PayloadAction<Batch[]>) => {
            batchAdapter.setAll(state, action.payload)
        },
        batchAdded: (state, action: PayloadAction<Batch>) => {
            batchAdapter.setOne(state, action.payload)
        },
        batchLoadingChanged: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
        batchDeleted: (state, action: PayloadAction<string>) => {
            batchAdapter.removeOne(state, action.payload)
        }, 
        batchUpdated: (state, action: PayloadAction<Batch>) => {
            batchAdapter.upsertOne(state, action.payload)
        }
    }
});

export const selectBatchLoading = (state: RootState) => state.batchReducer.loading;

export const {
    selectAll: selectAllBatches,
    selectById: selectBatchById,
    selectEntities: selectBatchEntities
} = batchAdapter.getSelectors<RootState>( state => state.batchReducer );

export const {
    batchesRecieved,
    batchAdded,
    batchLoadingChanged,
    batchDeleted,
    batchUpdated
} = batchSlice.actions;

export default batchSlice.reducer;