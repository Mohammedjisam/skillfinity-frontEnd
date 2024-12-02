import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addAdmin } from '@/redux/slice/AdminSlice';
import { toast } from 'sonner';
import axiosInstance from '@/AxiosConfig';
import { Eye, EyeOff } from 'lucide-react';

const AdminLogin = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            return toast.error("Please fill in all fields");
        }

        setIsLoading(true);
        try {
            const response = await axiosInstance.post("/admin/login", {
                email,
                password
            }, { withCredentials: true });

            if (response.data) {
                dispatch(addAdmin(response.data.adminData));
                toast.success(response.data.message);
                navigate("/admin/dashboard");
            } else {
                toast.error('No data received from server');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login failed';
            console.error(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row lg:max-w-5xl">
                <div className="md:w-1/2 h-56 md:h-auto">
                    <img
                        src="/AdminLogin.jpg"
                        alt="Login visual"
                        className="w-full h-full object-cover object-center"
                    />
                </div>
                <div className="w-full md:w-1/2 p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                    <h2 className="text-2xl md:text-3xl lg:text-3xl font-semibold mb-2 md:mb-4">Admin Login</h2>
                    <p className="mb-4 lg:mb-5 text-gray-500 text-sm md:text-base">Welcome back! Please log in to access your admin account.</p>
                    <form className="space-y-4 lg:space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-gray-700 font-medium text-sm md:text-base mb-1">Email</label>
                            <input
                                id="email"
                                type="email"
                                className="w-full border border-gray-300 p-2 md:p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                                placeholder="Enter your Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-gray-700 font-medium text-sm md:text-base mb-1">Password</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    className="w-full border border-gray-300 p-2 md:p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                                    placeholder="Enter your Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember" className="ml-2 block text-sm md:text-base text-gray-900">
                                    Remember me
                                </label>
                            </div>
                            <button
                                type="button"
                                onClick={() => navigate('/admin/forgot-password')}
                                className="text-sm md:text-base text-blue-500 hover:underline cursor-pointer"
                            >
                                Forgot Password?
                            </button>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-gray-600 text-white p-2 md:p-3 rounded-md hover:bg-gray-700 transition duration-300 text-sm md:text-base font-medium"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;

