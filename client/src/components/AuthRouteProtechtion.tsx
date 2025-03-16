import { RouteSignIn } from '@/helpers/RouteName'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { RootState } from '@/store' // Adjust the import according to your store setup

const AuthRouteProtechtion: React.FC = () => {
    const user = useSelector((state: RootState) => state.user)
    if (user && user.isLoggedIn) {
        return (
            <Outlet />
        )
    } else {
        return <Navigate to={RouteSignIn} />
    }
}

export default AuthRouteProtechtion
