import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { toast } from 'sonner';
import Otp from '../../components/common/Otp';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { addUser } from '@/redux/slice/UserSlice';
import { useDispatch } from 'react-redux';
import axiosInstance from '@/AxiosConfig';

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOTPDialogOpen, setIsOTPDialogOpen] = useState(false);
  const [serverOTP, setServerOTP] = useState(""); // New state to store server-generated OTP
  
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const validate = () => {
    const error = {};

    if (!name?.trim()) {
      error.name = "Name is required";
    } else if (/^\d/.test(name.trim())) {
      error.name = "Name should not start with a number";
    } else if (!/^[a-zA-Z0-9\s]+$/.test(name.trim())) {
      error.name = "Name can only contain letters, numbers, and spaces";
    }

    if (!email?.trim()) {
      error.email = "Email is required";
    } else if (/^\d/.test(email.trim())) {
      error.email = "Email should not start with a number";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())
    ) {
      error.email = "Invalid email format";
    }

    if (!phone?.trim()) {
      error.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone.trim())) {
      error.phone = "Phone number should be 10 digits";
    }

    if (!password?.trim()) {
      error.password = "Password is required";
    } else if (!/^[a-zA-Z0-9]{8,}$/.test(password.trim())) {
      error.password =
        "Password must be at least 8 characters long and contain only letters and numbers";
    }

    return error;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length === 0) {
      if (password === confirmPassword) {
        try {
          toast.success("Generating OTP, please wait");
          const response = await axiosInstance.post("/user/sendotp", { email });
          toast.success(response.data.message);
          setServerOTP(response.data.otp);
          console.log(response.data.otp) 
          setIsOTPDialogOpen(true);
        } catch (err) {
          if (err.response && err.response.status === 409) {
            return toast.error(err.response.data.message);
          }
          toast.error("An error occurred. Please try again.");
        }
      } else {
        toast.error("Confirm password does not match");
      }
    } else {
      Object.values(errors).forEach(error => toast.error(error));
    }
  };

  const handleOTPVerify = async (otpString) => {
    // Check if the entered OTP matches the one from the server
    if (otpString !== serverOTP) {
      toast.error("Invalid OTP. Please try again.");
      return;
    }

    try {
      const response = await axiosInstance.post("/user/create", {
        name,
        email,
        phone,
        password,
        otp: otpString,
      });
     
      dispatch(addUser(response.data.userData)); 
      toast.success(response.data.message);
      navigate("/home");
      setIsOTPDialogOpen(false);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        toast.error(err.response.data.message);
      } else if (err.response && err.response.status === 401) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await axiosInstance.post("/user/sendotp", { email });
      setServerOTP(response.data.otp); // Update the stored OTP
      toast.success(response.data.message || "OTP resent successfully");
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
      console.error(error);
    }
  };



  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      if (!credentialResponse || !credentialResponse.credential) {
        toast.error("Google credentials are missing");
        return;
      }
  
      const response = await axiosInstance.post(`/auth/google`, 
        { 
          credential: credentialResponse.credential,
          role: 'student' // Default role, can be dynamic if needed
        }, 
        { withCredentials: true }
      );
  
      dispatch(addUser(response.data.user));
      navigate("/home");
      toast.success("Login successful!");
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Google Login failed';
      console.error(errorMessage);
      toast.error(errorMessage);
    }
  };
  
  const handleGoogleFailure = () => {
    toast.error("Google login was unsuccessful");
};


return (
  <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
    <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 h-48 md:h-auto">
          <img
            src="/people-2569404.jpg"
            alt="Sign up visual"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="md:w-1/2 p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6 text-center md:text-left">Sign Up</h2>
          <form className="space-y-4" onSubmit={handleSignUp}>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Mobile</label>
              <input
                type="tel"
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Enter your number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="h-4 w-4 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <label className="text-sm">I agree with Terms of Use and Privacy Policy</label>
            </div>
            <button
              type="submit"
              className="w-full bg-gray-600 text-white p-2 rounded hover:bg-gray-700 transition duration-300"
            >
              Sign Up
            </button>
            <div className="text-center mt-4 text-sm">OR</div>
            <GoogleLogin
              className="w-full bg-gray-100 text-gray-800 p-2 rounded-md hover:bg-gray-200 transition duration-300 text-sm"
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
            />
          </form>
          <p className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <a
              onClick={(e) => {
                e.preventDefault();
                navigate('/login');
              }}
              className="text-blue-500 hover:underline cursor-pointer"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
    
    {isOTPDialogOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <Otp
            email={email}
            onVerify={handleOTPVerify}
            onResend={handleResendOTP}
          />
        </div>
      </div>
    )}
  </div>
);
};

export default SignUp;