import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
    isLoggedIn: boolean;
    user: Record<string, any>;
}

const initialState: UserState = {
    isLoggedIn: false,
    user: {},
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<Record<string, any>>) => {
            const payload = action.payload
            state.isLoggedIn = true
            state.user = payload
        },
        removeUser: (state) => {
            state.isLoggedIn = false
            state.user = {}
        }
    },
})

export const { setUser, removeUser } = userSlice.actions
export default userSlice.reducer
