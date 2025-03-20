import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../helpers/firebase";
import { toast } from "react-toastify";
import { RouteIndex } from '@/helpers/RouteName';

import { setDoc, doc } from "firebase/firestore";
import { showToast } from '@/helpers/showToast';

import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for API calls
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/user/user.slice';

function SignInwithGoogle() {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  function googleLogin() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
    .then(async (result) => {
      console.log("result", result);
      const user = result.user;
      if (result.user) {
  
        try {
            const data = await axios.post("http://localhost:3000/api/auth/google_login", {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            photo: user.photoURL,
          });
          console.log("data", data);
          console.log(result.user, "kkkk")
          localStorage.setItem('token', result.user.accessToken)
          dispatch(setUser(data.data.user))
          navigate(RouteIndex)
          showToast('success', data.message)
        } catch (error) {
          console.error("API call failed:", error);
          toast.error("Failed to log in. Please try again.", {
            position: "top-center",
          });
        }
      } 
    });
  }
  return (
    <div>
      <p className="continue-p">--Or continue with--</p>
      <div
        style={{ display: "flex", justifyContent: "center", cursor: "pointer" }}
        onClick={googleLogin}
      >
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRY6k7FoxDp5rODuFyEIYpefjasfow1lC1Fg&s" width={"60%"} />
      </div>
    </div>
  );
}
export default SignInwithGoogle;