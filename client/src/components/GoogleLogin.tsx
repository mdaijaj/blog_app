import React from 'react'
import { Button } from './ui/button'
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '@/helpers/firebase';
import { RouteIndex } from '@/helpers/RouteName';
import { showToast } from '@/helpers/showToast';
import { getEvn } from '@/helpers/getEnv';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/user/user.slice';

const GoogleLogin: React.FC = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleLogin = async () => {
        try {
            const googleResponse = await signInWithPopup(auth, provider)
            console.log("googleResponse---" ,googleResponse)
            const user = googleResponse.user
            const bodyData = {
                name: user.displayName,
                email: user.email,
                avatar: user.photoURL
            }

            console.log("googleResponse---" ,googleResponse)
            const response = await fetch(`${getEvn('VITE_API_BASE_URL')}/auth/google-login`, {
                method: 'post',
                headers: { 'Content-type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(bodyData)
            })

            console.log("response---" ,response)
            const data = await response.json()
            console.log("data---" ,data)    
            if (!response.ok) {
                return showToast('error', data.message)
            }
            // Store token in local storage
            localStorage.setItem('token', data.token)
            dispatch(setUser(data.user))
            navigate(RouteIndex)
            showToast('danger', data.message)
        } catch (error) {
            showToast('error', error.message)
        }
    }
    return (
        <Button variant="outline" className="w-full" onClick={handleLogin} >
            <FcGoogle />
            Continue With Google
        </Button>
    )
}

export default GoogleLogin
