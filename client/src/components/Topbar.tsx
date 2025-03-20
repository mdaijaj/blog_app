import React, { useState, useEffect } from 'react'
import logo from '@/assets/images/logo-white.png'
import { Button } from './ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { MdLogin } from "react-icons/md";
import SearchBox from './SearchBox';
import { RouteBlogAdd, RouteIndex, RouteProfile, RouteSignIn } from '@/helpers/RouteName';
import { useDispatch, useSelector } from 'react-redux';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import usericon from '@/assets/images/user.png'
import { FaRegUser } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { IoLogOutOutline } from "react-icons/io5";
import { removeUser } from '@/redux/user/user.slice';
import { showToast } from '@/helpers/showToast';
import { getEvn } from '@/helpers/getEnv';
import { AiOutlineMenu } from "react-icons/ai";
import { useSidebar } from './ui/sidebar';
import { IoMdSearch } from "react-icons/io";
import { auth } from '@/helpers/firebase'; // Import Firebase auth
import { onAuthStateChanged } from 'firebase/auth'; // Import Firebase auth state listener

const getTokenFromHeader = (req: any) => {
    return req.headers['access_token'];
}

const Topbar: React.FC = () => {
    const { toggleSidebar } = useSidebar()
    const [showSearch, setShowSearch] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector((state: any) => state.user)
    const [firebaseUser, setFirebaseUser] = useState<any>(null); // State to track Firebase user
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        // Listen to Firebase auth state changes
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setFirebaseUser({
                    name: currentUser.displayName,
                    email: currentUser.email,
                    avatar: currentUser.photoURL,
                });
            } else {
                setFirebaseUser(null);
            }
            setLoading(false); // Set loading to false after auth state is resolved
        });
        return () => unsubscribe(); // Cleanup listener on unmount
    }, []);

    const handleLogout = async () => {
        try {
            const token = getTokenFromHeader({ headers: { 'access_token': localStorage.getItem('token') || '' } })
            localStorage.removeItem('token'); // Remove token from localStorage
            dispatch(removeUser());
            setFirebaseUser(null); // Clear Firebase user state
            navigate(RouteIndex);
            showToast('danger', "Logout user successfully!");
        } catch (error) {
            showToast('error', error.message || 'An error occurred during logout');
        }
    };

    const toggleSearch = () => {
        setShowSearch(!showSearch)
    }

    return (
        <div className='flex justify-between items-center h-16 fixed w-full z-20 bg-white px-5 border-b'>
            <div className='flex justify-center items-center gap-2'>
                <button onClick={toggleSidebar} className='md:hidden' type='button'>
                    <AiOutlineMenu />
                </button>
                <Link to={RouteIndex}>
                    <img src={logo} className='md:w-auto w-48' />
                </Link>
            </div>
            <div className='w-[500px]'>
                <div className={`md:relative md:block absolute bg-white left-0 w-full md:top-0 top-16 md:p-0 p-5 ${showSearch ? 'block' : 'hidden'}`}>
                    <SearchBox />
                </div>
            </div>
            <div className='flex items-center gap-5'>
                <button onClick={toggleSearch} type='button' className='md:hidden block'>
                    <IoMdSearch size={25} />
                </button>
                {loading ? null : ( 
                    !user.isLoggedIn ? ( 
                        <Button asChild className="rounded-full">
                            <Link to={RouteSignIn}>
                                <MdLogin />
                                Sign In
                            </Link>
                        </Button>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Avatar>
                                    {console.log(user.user, "kkk")}
                                <AvatarImage src={(user.user.avatar) || usericon || firebaseUser?.avatar} />
                                </Avatar>
                                <h2>{user?.user?.name}</h2>

                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>
                                    <Link to={RouteIndex}>
                                        <Avatar>
                                            <AvatarImage src={(firebaseUser?.avatar || user.user.avatar) || usericon} />
                                        </Avatar>
                                        <p>{firebaseUser?.name || user.user.name}</p>
                                    </Link>
                                    <p className='text-sm'>{firebaseUser?.email || user.user.email}</p>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild className="cursor-pointer">
                                    <Link to={RouteProfile}>
                                        <FaRegUser />
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="cursor-pointer">
                                    <Link to={RouteBlogAdd}>
                                        <FaPlus />
                                        Create Blog
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                                    <IoLogOutOutline color='red' />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )
                )}
            </div>
        </div>
    )
}

export default Topbar
