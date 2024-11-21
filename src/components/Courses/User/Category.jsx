import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Heart, ShoppingCart, TrendingUp, Play } from 'lucide-react'
import axiosInstance from './../../../AxiosConfig'
import { Card } from '@/components/ui/card'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from 'sonner'
import { useSelector } from 'react-redux'

export default function CategoryPage() {
  const { categoryId } = useParams()
  const [categoryData, setCategoryData] = useState([])
  const [loading, setLoading] = useState(true)
  const [cartItems, setCartItems] = useState([])
  const [purchasedCourses, setPurchasedCourses] = useState([])
  const navigate = useNavigate()
  const userDatas = useSelector((store) => store.user.userDatas)

  useEffect(() => {
    fetchCategoryData()
    fetchCartData()
    fetchPurchasedCourses()
  }, [categoryId, userDatas._id])

  const fetchCategoryData = async () => {
    try {
      const response = await axiosInstance.get(`/user/data/viewcategory/${categoryId}`)
      const courses = response.data.courses || []
      console.log("Fetched category data:", courses)
      setCategoryData(courses)
    } catch (error) {
      console.error("Error fetching category data:", error)
      setCategoryData([])
      toast.error("Failed to load courses for this category.")
      if (error.response) {
        console.error("Response data:", error.response.data)
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchCartData = async () => {
    try {
      if (!userDatas || !userDatas._id) {
        console.log("User data not available, skipping cart fetch")
        return
      }
      const cartResponse = await axiosInstance.post("/user/data/cart", {
        userId: userDatas._id,
      })
      const cartCourseIds = cartResponse.data.cart?.items.map(item => item.courseId._id) || []
      setCartItems(cartCourseIds)
    } catch (error) {
      console.error("Error fetching cart information:", error)
      if (error.response) {
        console.error("Response data:", error.response.data)
      }
    }
  }

  const fetchPurchasedCourses = async () => {
    try {
      if (!userDatas || !userDatas._id) {
        console.log("User data not available, skipping purchased courses fetch")
        return
      }
      const response = await axiosInstance.get(`/user/data/purchasedcourses/${userDatas._id}`)
      setPurchasedCourses(response.data.purchasedCourses || [])
    } catch (error) {
      console.error("Error fetching purchased courses:", error)
    }
  }

  const handleAddToCart = async (courseId) => {
    try {
      if (!userDatas || !userDatas._id) {
        toast.error("Please log in to add items to cart.")
        return
      }
      await axiosInstance.post(`/user/data/addcart/${courseId}`, { userId: userDatas._id })
      toast.success("Course added to cart successfully!")
      setCartItems(prevItems => [...prevItems, courseId])
    } catch (error) {
      console.error("Error adding course to cart:", error)
      toast.error("Failed to add course to cart.")
    }
  }

  const goToCart = () => {
    navigate('/cart')
  }

  const handleWatchLessons = (courseId) => {
    navigate(`/course/${courseId}/lessons`)
  }

  const isPurchased = (courseId) => {
    return purchasedCourses.includes(courseId)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryData && categoryData.length > 0 ? (
            categoryData
              .filter((course) => course.isVisible !== false)
              .map((course) => (
                <Card 
                  key={course._id} 
                  className="bg-gray-200 rounded-lg overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1"
                >
                  <div className="relative">
                    <img
                      src={course.thumbnail || "/placeholder.svg?height=200&width=400"}
                      alt={course.coursetitle}
                      className="w-full h-48 object-cover"
                    />
                    <button className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors">
                      <Heart className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={course.tutor?.profileImage} />
                        <AvatarFallback>{course.tutor?.name ? course.tutor.name[0] : 'T'}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {course.tutor?.name || 'Tutor'}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {course.coursetitle}
                    </h3>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{course.price}
                      </span>
                      <div className="flex items-center text-gray-500">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span className="text-sm">{course.difficulty || 'All Levels'}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="default"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => navigate(`/coursedetails/${course._id}`)}
                      >
                        View Details
                      </Button>
                      {isPurchased(course._id) ? (
                        <Button
                          onClick={() => handleWatchLessons(course._id)}
                          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Watch Lessons
                        </Button>
                      ) : cartItems.includes(course._id) ? (
                        <Button
                          variant="default"
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                          onClick={goToCart}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Go to Cart
                        </Button>
                      ) : (
                        <Button
                          variant="default"
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleAddToCart(course._id)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No courses available in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}