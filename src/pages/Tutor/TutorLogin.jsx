import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { addTutor } from "@/redux/slice/TutorSlice";
import { toast } from "sonner";
import axiosInstance from "@/AxiosConfig";

const TutorLogin = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};

    if (!email?.trim()) {
      errors.email = "Email is required";
    } else if (/^\d/.test(email.trim())) {
      errors.email = "Email should not start with a number";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())
    ) {
      errors.email = "Invalid email format";
    }

    if (!password?.trim()) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();

    if (Object.keys(errors).length === 0) {
      try {
        const response = await axiosInstance.post(
          "/tutor/login",
          { email, password },
          { withCredentials: true }
        );
        if (response.data) {
          dispatch(addTutor(response.data.userData));
          navigate("/tutor/dashboard");
          return toast.success(response.data.message);
        } else {
          toast.error("No data received from server");
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Login failed";
        console.error(errorMessage);
        toast.error(errorMessage);
      }
    } else {
      Object.values(errors).forEach(error => toast.error(error));
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axiosInstance.post(
        `/auth/google`,
        { token: credentialResponse.credential },
        { withCredentials: true }
      );
      dispatch(addTutor(response.data.user));
      navigate("/dashboard");
      toast.success("Login successful!");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Google Login failed";
      console.error(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleGoogleFailure = () => {
    toast.error("Google login was unsuccessful");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2">
          <img
            src="/pexels-karolina-grabowska-6958515[1].jpg"
            alt="Login visual"
            className="w-full h-full object-cover rounded-t-lg md:rounded-none md:rounded-l-lg"
          />
        </div>
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-semibold mb-4">Tutor Login</h2>
          <p className="mb-4 text-gray-500">
            Welcome back! Please log in to access your tutor account.
          </p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <a
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/tutor/forgot-password");
                }}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                Forgot Password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-gray-600 text-white p-3 rounded-md hover:bg-gray-700 transition duration-300"
            >
              Login as Tutor
            </button>
            <GoogleLogin
              className="w-full bg-gray-100 text-gray-800 p-3 rounded-md hover:bg-gray-200 transition duration-300"
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
            />
          </form>
          <p className="mt-4 text-center">
            Don't have an account?{" "}
            <a
              onClick={(e) => {
                e.preventDefault();
                navigate("/tutor/signup");
              }}
              className="text-blue-500 hover:underline cursor-pointer"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TutorLogin;