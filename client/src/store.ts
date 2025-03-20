import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './redux/user/user.slice'
import localStorage from 'redux-persist/es/storage'
import persistReducer from 'redux-persist/es/persistReducer'
import persistStore from 'redux-persist/es/persistStore'
import { PersistConfig } from 'redux-persist'

const rootReducer = combineReducers({
    user: userReducer
})

const persistConfig: PersistConfig<any> = {
    key: 'root',
    storage: localStorage,
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false })
})

export const persistor = persistStore(store)

const handleLogout = async () => {
    try {
        const token = getTokenFromHeader({ headers: { 'access_token': localStorage.getItem('accessToken') || '' } });
        console.log("token", token);
        const response = await fetch(`${getEvn('VITE_API_BASE_URL')}/auth/logout`, {
            method: 'get',
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (!response.ok) {
            return showToast('error', data.message);
        }
        localStorage.removeItem('accessToken'); 
        dispatch(removeUser());
        setFirebaseUser(null); 
        navigate(RouteIndex);
        showToast('success', data.message);
    } catch (error) {
        showToast('error', error.message || 'An error occurred during logout');
    }
};
