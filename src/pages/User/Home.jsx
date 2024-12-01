import React, { useEffect, useState } from "react";
import {
  Laptop,
  Code,
  Database,
  Globe,
  Clock,
  Users,
  ChevronRight,
  Star,
  ArrowRight,
  BookOpen,
  Tag,
  Cloud,
  Shield,
  Cpu,
  Smartphone,
  Wifi,
  Server,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../AxiosConfig";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tutors, setTutors] = useState([]); // State for tutors data
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingTutors, setLoadingTutors] = useState(true);
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate("/allcourse");
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get(
          "/user/data/viewallcourse?limit=4"
        );
        const visibleCourses = response.data.courses.filter(
          (course) => course.isVisible
        );
        setCourses(visibleCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoadingCourses(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get(
          "/user/data/viewallcategory?limit=4"
        );
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    const fetchTutors = async () => {
      try {
        const response = await axiosInstance.get("/user/data/viewalltutors");
        setTutors(response.data.tutors);
        console.log(response.data.tutors);
      } catch (error) {
        console.error("Error fetching tutors:", error);
      } finally {
        setLoadingTutors(false);
      }
    };

    fetchCourses();
    fetchCategories();
    fetchTutors();
  }, []);

  const formatDuration = (minutes) => {
    if (!minutes) return "Duration not specified";

    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (remainingMinutes === 0) {
        return `${hours} hour${hours !== 1 ? "s" : ""}`;
      } else {
        return `${hours} hour${
          hours !== 1 ? "s" : ""
        } ${remainingMinutes} minute${remainingMinutes !== 1 ? "s" : ""}`;
      }
    }
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  const handleViewAllCategories = () => {
    navigate("/viewallcategories");
  };

  const handleViewAllTutors = () => {
    navigate("/viewalltutors");
  };

  const getCategoryIcon = (categoryName) => {
    switch (categoryName.toLowerCase()) {
      case "web development":
        return <Laptop className="w-12 h-12 text-blue-500" />;
      case "programming":
        return <Code className="w-12 h-12 text-green-500" />;
      case "data science":
        return <Database className="w-12 h-12 text-purple-500" />;
      case "digital marketing":
        return <Globe className="w-12 h-12 text-red-500" />;
      case "cloud computing":
        return <Cloud className="w-12 h-12 text-sky-500" />;
      case "cybersecurity":
        return <Shield className="w-12 h-12 text-yellow-500" />;
      case "artificial intelligence":
        return <Cpu className="w-12 h-12 text-indigo-500" />;
      case "mobile app development":
        return <Smartphone className="w-12 h-12 text-pink-500" />;
      case "networking":
        return <Wifi className="w-12 h-12 text-orange-500" />;
      case "devops":
        return <Server className="w-12 h-12 text-amber-500" />;
      default:
        return <BookOpen className="w-12 h-12 text-gray-500" />;
    }
  };

  
  const renderCategoryFallback = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((index) => (
        <div key={index} className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg">
          <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-6 bg-gray-200 w-3/4 mb-2 rounded"></div>
          <div className="h-4 bg-gray-200 w-5/6 rounded"></div>
        </div>
      ))}
    </div>
  );

  const renderCourseFallback = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {[1, 2, 3, 4].map((index) => (
        <Card key={index} className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border-none shadow-lg">
          <div className="h-48 bg-gray-200"></div>
          <CardHeader className="pb-2">
            <div className="h-6 bg-gray-200 w-3/4 rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="h-4 bg-gray-200 w-1/2 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 w-1/3 rounded"></div>
          </CardContent>
          <CardFooter className="flex justify-between items-center pt-2">
            <div className="h-8 bg-gray-200 w-1/4 rounded"></div>
            <div className="h-10 bg-gray-200 w-1/3 rounded"></div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  const renderTutorFallback = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
      {[1, 2, 3, 4, 5, 6].map((index) => (
        <div key={index} className="text-center">
          <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gray-200"></div>
          <div className="h-6 bg-gray-200 w-3/4 mx-auto mb-2 rounded"></div>
          <div className="h-4 bg-gray-200 w-1/2 mx-auto rounded"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-gray-100 to-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            Unlock Your Creative Potential
          </h1>
          <p className="text-xl mb-8 text-gray-600">
            with Online Design and Development Courses.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
              onClick={handleExploreClick}
            >
              Explore Courses
            </Button>
            <Button
              variant="outline"
              className="bg-white hover:bg-gray-100 text-gray-700 font-bold py-3 px-6 rounded-full border-2 border-gray-700 transition duration-300 ease-in-out transform hover:scale-105"
              onClick={handleExploreClick}
            >
              View Pricing
            </Button>
          </div>
        </header>
        <div className="mb-16">
          <div className="relative h-96 rounded-xl overflow-hidden shadow-2xl">
            <img
              src="/business-8676529.jpg"
              alt="People in a meeting"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-600 opacity-30"></div>
          </div>
        </div>
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Course Categories</h2>
            <Button
              variant="ghost"
              className="flex items-center text-gray-700 hover:text-gray-900 font-semibold transition duration-300 ease-in-out group"
              onClick={handleViewAllCategories}
            >
              View All <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          {loadingCategories ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.slice(0, 4).map((category) => (
                <div
                  key={category._id}
                  className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                  onClick={() => handleCategoryClick(category._id)}
                >
                  <div className="text-gray-700 mb-4">
                    {getCategoryIcon(category.title)}
                  </div>
                  <span className="text-lg font-semibold text-gray-800 mb-2">
                    {category.title}
                  </span>
                  <p className="text-sm text-gray-600 text-center">
                    {category.description ||
                      "Explore our courses in this category."}
                  </p>
                </div>
                ))}
                </div>
              ) : (
                renderCategoryFallback()
              )}
            </section>
            <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Explore Courses</h2>
            <Button
              variant="ghost"
              className="flex items-center text-gray-700 hover:text-gray-900 font-semibold transition duration-300 ease-in-out group"
              onClick={handleExploreClick}
            >
              View All <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          {loadingCourses ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {courses.slice(0, 4).map((course) => (
                <Card
                  key={course._id}
                  className="group relative overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 bg-white dark:bg-gray-800/50 backdrop-blur-sm border-none shadow-lg"
                  onClick={() => navigate(`/viewcourse/${course._id}`)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={
                        course.thumbnail ||
                        "/placeholder.svg?height=192&width=384"
                      }
                      alt={course.coursetitle}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 flex items-center bg-white dark:bg-gray-800 rounded-full px-3 py-1 shadow-md">
                      <Tag className="w-4 h-4 text-primary mr-2" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {course.difficulty}
                      </span>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 line-clamp-2">
                      {course.coursetitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {course.lessons && course.lessons.length > 0
                          ? formatDuration(
                              course.lessons.reduce(
                                (total, lesson) =>
                                  total + (lesson.duration || 0),
                                0
                              )
                            )
                          : "Duration not specified"}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {course.students || "1.2k"} students
                      </div>
                    </div>
                    <div className="flex items-center mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-4 h-4 text-yellow-400 fill-yellow-400"
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        (128)
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center pt-2">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Price
                      </span>
                      <span className="text-2xl font-bold text-primary">
                        ₹{course.price}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      className="relative overflow-hidden group/button bg-gray-300 border-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/coursedetails/${course._id}`);
                      }}
                    >
                      <span className="relative z-10 group-hover/button:text-gray transition-colors">
                        View Details
                      </span>
                      <div className="absolute inset-0 bg-primary transform -translate-x-full group-hover/button:translate-x-0 transition-transform" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              </div>
            ) : (
              renderCourseFallback()
            )}
          </section>
        <section className="mb-16">
          <div className="bg-white rounded-xl overflow-hidden shadow-lg">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2">
                <img
                  src="/pexels-julia-m-cameron-4144222.jpg"
                  alt="One to one session"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8 flex flex-col justify-center">
                <p className="text-xl text-gray-600 mb-6">
                  Welcome to <b>Skillfinity</b>, a dynamic platform designed to
                  elevate your learning experience. With 24/7 community support,{" "}
                  <b>Skillfinity</b> ensures that help is always within reach.
                  You can easily book learning sessions, track your progress
                  with detailed analytics, and follow personalized learning
                  paths to achieve your goals. Additionally, our extensive
                  on-demand video library provides access to valuable content
                  anytime. <b>Skillfinity</b> empowers you to grow and learn
                  with ease.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Our Expert Tutors</h2>
            <Button
              variant="ghost"
              className="flex items-center text-gray-700 hover:text-gray-900 font-semibold transition duration-300 ease-in-out group"
              onClick={handleViewAllTutors}
            >
              View All <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          {loadingTutors ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : tutors.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
              {tutors.slice(0, 6).map((tutor) => (
                <div
                  key={tutor._id}
                  className="text-center cursor-pointer"
                  onClick={() => navigate(`/viewtutor/${tutor._id}`)}
                >
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden shadow-lg">
                    {tutor.profileImage ? (
                      <img
                        src={tutor.profileImage}
                        alt={tutor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <User className="w-16 h-16 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <p className="font-semibold text-xl text-gray-800 mb-2">
                    {tutor.name}
                  </p>
                  <p className="text-gray-600">{tutor.specialization}</p>
                </div>
                 ))}
                 </div>
               ) : (
                 renderTutorFallback()
               )}
             </section>
           </div>
         </div>
       );
     }
     
     