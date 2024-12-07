import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../AxiosConfig";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart, Trash2, BookOpen, User, Tag, BarChart } from 'lucide-react';
import { setCartItems, updateCartCount } from "../../../redux/slice/CartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const userDatas = useSelector((store) => store.user.userDatas);
  const cartItems = useSelector((store) => store.cart.items);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartAndCheckPurchases = async () => {
      try {
        const cartResponse = await axiosInstance.post(`/user/data/cart`, {
          userId: userDatas._id,
        });
        
        const purchaseResponse = await axiosInstance.get(`/user/data/checkPurchases/${userDatas._id}`);
        const purchasedCourseIds = purchaseResponse.data.purchasedCourseIds;

        const filteredCartItems = cartResponse.data.cart.items.filter(
          item => !purchasedCourseIds.includes(item.courseId._id)
        );

        dispatch(setCartItems(filteredCartItems));
        dispatch(updateCartCount(filteredCartItems.length));
      } catch (error) {
        console.error("Error fetching cart data:", error);
        toast.error("Failed to fetch cart data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartAndCheckPurchases();
  }, [userDatas._id, dispatch]);

  const handleRemove = async (courseId) => {
    try {
      setIsProcessing(true);
      await axiosInstance.delete(`/user/data/removecart/`, {
        params: {
          userId: userDatas._id,
          courseId,
        },
      });
      const updatedItems = cartItems.filter((item) => item.courseId._id !== courseId);
      dispatch(setCartItems(updatedItems));
      dispatch(updateCartCount(updatedItems.length));
      toast.success("Course removed from cart successfully!");
    } catch (error) {
      console.error("Error removing course from cart:", error);
      toast.error("Failed to remove course from cart.");
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price || 0), 0);
  };

  const handleBuyAll = () => {
    const courseIds = cartItems.map((item) => item.courseId._id);
    navigate("/buyallcourses", {
      state: { courseIds, totalAmount: calculateTotal() },
    });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <h2 className="text-2xl font-semibold">Loading Cart...</h2>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <ShoppingCart className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-600">Add some courses to get started!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <ShoppingCart className="mr-2" />
        Shopping Cart ({cartItems.length} items)
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {cartItems.map((item) => {
          const course = item.courseId;
          if (!course || !course._id) return null;

          return (
            <Card key={course._id} className="flex flex-col">
              <CardHeader className="p-0">
                <img
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.coursetitle || "Course Thumbnail"}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent className="flex-grow p-4">
                <CardTitle className="text-xl mb-2">{course.coursetitle || "Course Title"}</CardTitle>
                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    <span>{course.tutorName}</span>
                  </div>
                  <div className="flex items-center">
                    <Tag className="w-4 h-4 mr-1" />
                    <span>{course.categoryName}</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-1" />
                    <span>{course.totalLessonsCount} lessons</span>
                  </div>
                  <div className="flex items-center">
                    <BarChart className="w-4 h-4 mr-1" />
                    <span>{course.difficulty}</span>
                  </div>
                </div>
                <p className="font-bold text-lg">₹{item.price}</p>
              </CardContent>
              <CardFooter className="bg-gray-50 p-4 mt-auto">
                <Button
                  onClick={() => handleRemove(course._id)}
                  disabled={isProcessing}
                  variant="destructive"
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Total: ₹{calculateTotal()}
              </h3>
              <p className="text-gray-600">Total items: {cartItems.length}</p>
            </div>
            <Button
              onClick={handleBuyAll}
              disabled={isProcessing}
              size="lg"
              className="w-full sm:w-auto"
            >
              Buy All Courses
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cart;

