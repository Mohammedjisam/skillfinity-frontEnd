import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MonitorPlay, User, CheckCircle } from "lucide-react";
import RazorPay from "./RazorPay";
import { toast } from "sonner";
import axiosInstance from "@/AxiosConfig";
import { useSelector } from "react-redux";

function CourseBuy() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRazorPay, setShowRazorPay] = useState(false);
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const userData = useSelector((store) => store.user.userDatas);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (courseId) {
          const response = await axiosInstance.post(
            `/user/data/buycourse/${courseId}`
          );
          setCourses([response.data.course]);
          console.log(response.data.course);
        } else if (location.state?.courseIds) {
          const response = await axiosInstance.post(
            "/user/data/buyallcourses",
            {
              userId: userData._id,
              courseIds: location.state.courseIds,
            }
          );
          setCourses(response.data.courses);
        } else {
          throw new Error("No course information provided");
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
        toast.error("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [courseId, location.state]);

  const calculateTotalPrice = () => {
    return courses.reduce((total, course) => total + (course.price || 0), 0);
  };

  const handlePurchase = () => {
    setShowRazorPay(true);
  };

  const handlePaymentSuccess = async () => {
    try {
      const userId = userData?._id; 
      const courseIds = courseId
        ? [courseId]
        : courses.map((course) => course._id);

      if (!userId) {
        throw new Error("User not authenticated");
      }

      await axiosInstance.post("/user/data/purchase", { userId, courseIds });

      toast.success("Course(s) purchased successfully!");
      navigate("/purchasedcourses");
    } catch (error) {
      console.error("Error recording purchase:", error);
      toast.error(
        "There was an issue recording your purchase. Please contact support."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 text-2xl text-gray-600">
        No courses found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-700 mb-8 text-center">
          Course Purchase
        </h1>
        <div className="space-y-8">
          {courses.map((course, index) => (
            <Card
              key={course._id || index}
              className="bg-white shadow-lg hover:shadow-xl transition-shadow border-none duration-300"
            >
              <CardHeader className="border-b border-gray-300 bg-gray-100">
                <CardTitle className="text-2xl md:text-3xl font-bold text-gray-800">
                  {course.coursetitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-2/5">
                    <div className="aspect-video rounded-lg overflow-hidden shadow-md">
                      <img
                        src={
                          course.thumbnail ||
                          "/placeholder.svg?height=400&width=800"
                        }
                        alt={course.coursetitle}
                        className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                  <div className="md:w-3/5 space-y-4">
                    <div className="flex flex-wrap gap-3">
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1"
                      >
                        <User className="w-4 h-4" />
                        {course.tutor?.name || "Unknown Tutor"}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1"
                      >
                        <MonitorPlay className="w-4 h-4" />
                        {course.lessons?.length || 0} Lessons
                      </Badge>
                    </div>
                    <div className="text-4xl font-bold text-gray-900">
                      ₹{course.price}
                    </div>
                    <div className="space-y-2">
                      {[
                        "24/7 support",
                        "Lifetime access",
                        "Certificate of completion",
                      ].map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center text-gray-700"
                        >
                          <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="mt-8 bg-gradient-to-b from-white to-gray-50 shadow-xl rounded-2xl border-none overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <CardFooter className="p-8">
            <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900">
                Total: ₹{calculateTotalPrice()}
              </div>
              <Button
                onClick={handlePurchase}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
              >
                Enroll Now
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      {showRazorPay && (
        <RazorPay
          courseDetails={{
            price: calculateTotalPrice(),
            coursetitle:
              courses.length > 1 ? "Multiple Courses" : courses[0].coursetitle,
          }}
          onClose={() => setShowRazorPay(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}

export default CourseBuy;
