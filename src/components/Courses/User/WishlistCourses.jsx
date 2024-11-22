import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "@/AxiosConfig";
import { ShoppingCart, User, Tag, Menu, X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Sidebar from "../../../pages/User/Sidebar";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";

export default function WishlistCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const userData = useSelector((store) => store.user.userDatas);
  const navigate = useNavigate();
  const { incrementCartCount } = useCart();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    fetchWishlistCourses();
  }, []);

  const fetchWishlistCourses = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/user/data/viewwishlist/${userData._id}`
      );
      console.log("API Response:", response.data);
      const coursesWithUniqueIds = response.data.wishlist.map(
        (course, index) => ({
          ...course,
          uniqueId: `${course._id}-${index}`,
        })
      );
      setCourses(coursesWithUniqueIds);
    } catch (error) {
      console.error(
        "Error fetching wishlist courses:",
        error.response?.data || error.message
      );
      setError("Failed to fetch wishlist courses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const moveToCart = async (courseId) => {
    console.log("couses id   ---->>", courseId);
    try {
      // Add to cart
      await axiosInstance.post(`/user/data/addcart/${courseId}`, {
        userId: userData._id,
      });
      incrementCartCount();

      // Remove from wishlist
      await axiosInstance.delete(
        `/user/data/removefromwishlist/${courseId}/${userData._id}`
      );

      toast.success("Course moved to cart successfully");
      fetchWishlistCourses(); // Refresh the wishlist
    } catch (error) {
      console.error("Error moving course to cart:", error);
      toast.error("Failed to move course to cart");
    }
  };

  const removeFromWishlist = async (courseId) => {
    try {
      await axiosInstance.delete(
        `/user/data/removefromwishlist/${courseId}/${userData._id}`
      );
      toast.success("Course removed from wishlist");
      fetchWishlistCourses();
    } catch (error) {
      console.error("Error removing course from wishlist:", error);
      toast.error("Failed to remove course from wishlist");
    }
  };

  const renderCourses = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <Card key={`skeleton-${index}`} className="w-full">
              <CardHeader className="space-y-2">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-48 w-full mb-4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3 mt-2" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      );
    }

    if (error) {
      return <p className="text-center text-red-600 text-lg">{error}</p>;
    }

    if (courses.length === 0) {
      return (
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Your wishlist is empty.</p>
          <Button
            onClick={() => navigate("/allcourse")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Explore Courses
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <Card
            key={course.id}
            className="w-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-none"
          >
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 line-clamp-2">
                {course.coursetitle}
              </CardTitle>
              <CardDescription className="flex items-center text-gray-600">
                <User className="w-4 h-4 mr-2" />
                {course.tutorname || "Unknown Tutor"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full mb-4 overflow-hidden rounded-md">
                <img
                  src={
                    course.thumbnail || "/placeholder.svg?height=200&width=300"
                  }
                  alt={course.coursetitle}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <Badge variant="secondary" className="flex items-center">
                  <Tag className="w-4 h-4 mr-2" />
                  {course.categoryname || "Uncategorized"}
                </Badge>
                <span className="font-bold text-blue-600">
                  ₹{course.price.toFixed(2)}
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => moveToCart(course.id)}
              >
                <ShoppingCart className="w-4 h-4 mr-2" /> Move to Cart
              </Button>
              <Button
                variant="outline"
                className="w-full text-red-600 hover:bg-red-50"
                onClick={() => removeFromWishlist(course.id)}
              >
                <X className="w-4 h-4 mr-2" /> Remove from Wishlist
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        activeItem="Wishlist"
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm lg:hidden">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">
              My Wishlist
            </h1>
            {renderCourses()}
          </div>
        </main>
      </div>
    </div>
  );
}

