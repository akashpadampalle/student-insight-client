import { createSlice, createEntityAdapter, PayloadAction } from "@reduxjs/toolkit";
import User from "../../models/User";
import { RootState } from "../../app/store";

const userAdapter = createEntityAdapter({
    selectId: (user: User) => user._id
})


const initialState = userAdapter.getInitialState({
    loading: false
})

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        usersRecieved: (state, action: PayloadAction<User[]>) => {
            userAdapter.setAll(state, action.payload)
        },
        userAdded: (state, action: PayloadAction<User>) => {
            userAdapter.setOne(state, action.payload)
        },
        userLoadingChanged: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
        userDeleted: (state, action: PayloadAction<string>) => {
            userAdapter.removeOne(state, action.payload)
        },
        userUpdated: (state, action: PayloadAction<User>) => {
            userAdapter.upsertOne(state, action.payload)
        }
    }
})

export const selectUserLoading = (state: RootState) => state.userReducer.loading

export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectEntities: selectAllUserEntities
} = userAdapter.getSelectors<RootState>( state => state.userReducer )


export const { 
    usersRecieved,
    userAdded,
    userLoadingChanged,
    userDeleted,
    userUpdated
} = userSlice.actions;

export default userSlice.reducer;