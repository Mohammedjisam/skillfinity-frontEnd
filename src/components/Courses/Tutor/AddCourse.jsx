
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Menu, Upload, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import SideBar from '../../../pages/Tutor/SideBar'
import axiosInstance from '../../../AxiosConfig'

const LoadingFallback = ({ progress, message }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <Card className="w-96 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">{message}</h2>
      <div className="flex justify-center mb-4">
        <Loader2 className="w-12 h-12 animate-spin text-teal-500" />
      </div>
      <Progress value={progress} className="mb-4" />
      <p className="text-center text-gray-600">
        {progress.toFixed(0)}% Complete
      </p>
    </Card>
  </div>
)

export default function AddCourse() {
  const tutor = useSelector(state => state.tutor.tutorDatas)
  const navigate = useNavigate()
  
  const [courseData, setCourseData] = useState({
    coursetitle: '',
    category: '',
    price: '',
    features: '',
    thumbnail: null,
    tutor: tutor._id,
    difficulty: '',
    courseStructure: ['', '', '']
  })
  const [errors, setErrors] = useState({})
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isAddingCourse, setIsAddingCourse] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [addCourseProgress, setAddCourseProgress] = useState(0)
  const [categories, setCategories] = useState([])

  const difficultyLevels = [
    'Beginner',
    'Elementary',
    'Intermediate',
    'Upper Intermediate',
    'Advanced',
    'Expert'
  ]

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/admin/categories')
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to load categories')
    }
  }

  const validateField = (name, value) => {
    let error = ''
    switch (name) {
      case 'coursetitle':
        if (value.length > 22) {
          error = 'Course title cannot exceed 22 characters'
        } else if (value.trim() === '') {
          error = 'Course title is required'
        } else if (!/^[a-zA-Z\s]*$/.test(value)) {
          error = 'Course title can only contain letters and spaces'
        }
        break
      case 'category':
        if (!value) error = 'Category is required'
        break
      case 'difficulty':
        if (!value) error = 'Difficulty level is required'
        break
      case 'price':
        if (!value) {
          error = 'Price is required'
        } else if (isNaN(value) || Number(value) < 0) {
          error = 'Price must be a positive number'
        }
        break
      case 'features':
        if (value.trim() === '') {
          error = 'Features are required'
        } else if (!/^[a-zA-Z\s]*$/.test(value)) {
          error = 'Features can only contain letters and spaces'
        }
        break
      default:
        break
    }
    return error
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    let sanitizedValue = value
    if (name === 'coursetitle' || name === 'features') {
      sanitizedValue = value.replace(/[^a-zA-Z\s]/g, '')
    }
    const error = validateField(name, sanitizedValue)
    setCourseData(prevData => ({
      ...prevData,
      [name]: sanitizedValue
    }))
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }))
  }

  const handleStructureChange = (index, value) => {
    const sanitizedValue = value.replace(/[^a-zA-Z\s]/g, '')
    setCourseData(prevData => ({
      ...prevData,
      courseStructure: prevData.courseStructure.map((item, i) => i === index ? sanitizedValue : item)
    }))
  }

  const addNewSection = () => {
    setCourseData(prevData => ({
      ...prevData,
      courseStructure: [...prevData.courseStructure, '']
    }))
  }



  const validateImage = (file) => {
    return new Promise((resolve, reject) => {
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        reject(new Error('Invalid file type. Please upload a JPEG, PNG, or WebP image.'));
      }

      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        reject(new Error('File size exceeds 5MB. Please upload a smaller image.'));
      }

      // Check image dimensions
      const img = new Image();
      img.onload = () => {
        if (img.width < 1280 || img.height < 720) {
          reject(new Error('Image dimensions should be at least 1280x720 pixels.'));
        } else {
          resolve();
        }
      };
      img.onerror = () => reject(new Error('Failed to load image. Please try again.'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await validateImage(file);
      setIsUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'skillfinity_media');
      formData.append('cloud_name', 'dwxnxuuht');
      
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://api.cloudinary.com/v1_1/dwxnxuuht/image/upload');
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(percentComplete);
        }
      };

      xhr.onload = function() {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setCourseData(prevData => ({
            ...prevData,
            thumbnail: response.secure_url
          }));
          setThumbnailPreview(response.secure_url);
          toast.success('Thumbnail uploaded successfully');
        } else {
          throw new Error('Failed to upload image');
        }
        setIsUploading(false);
      };

      xhr.onerror = function() {
        console.error('Image upload error');
        toast.error('Failed to upload thumbnail');
        setIsUploading(false);
      };

      xhr.send(formData);
    } catch (error) {
      console.error('Image validation error:', error);
      toast.error(error.message || 'Failed to upload thumbnail');
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}
    Object.keys(courseData).forEach(key => {
      if (key !== 'thumbnail' && key !== 'tutor') {
        if (key === 'courseStructure') {
          newErrors[key] = courseData[key].map(item => {
            if (!/^[a-zA-Z\s]*$/.test(item)) {
              return 'Section can only contain letters and spaces'
            }
            return ''
          })
        } else {
          const error = validateField(key, courseData[key])
          if (error) newErrors[key] = error
        }
      }
    })

    if (Object.keys(newErrors).some(key => 
      Array.isArray(newErrors[key]) ? newErrors[key].some(e => e !== '') : newErrors[key]
    )) {
      setErrors(newErrors)
      toast.error('Please correct the errors before submitting')
      return
    }

    if (!courseData.thumbnail) {
      toast.error('Please upload a thumbnail image')
      return
    }

    try {
      setIsAddingCourse(true)
      setAddCourseProgress(0)

      const interval = setInterval(() => {
        setAddCourseProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval)
            return prev
          }
          return prev + 5
        })
      }, 500)

      const response = await axiosInstance.post('/tutor/course/addcourse', courseData)
      
      clearInterval(interval)
      setAddCourseProgress(100)

      setTimeout(() => {
        setIsAddingCourse(false)
        toast.success('Course added successfully')
        navigate(`/tutor/addlesson/${response.data.course._id}`)
      }, 1000)
    } catch (error) {
      console.error('Error adding course:', error)
      toast.error(error.response?.data?.message || 'Failed to add course')
      setIsAddingCourse(false)
    }
  }



  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SideBar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        activeItem="Courses"
      />
      <div className="flex-1">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-bold">Add New Course</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </header>

        <main className="p-6">
          <Card className="max-w-[1200px] mx-auto bg-white p-8 rounded-lg shadow-sm border-dashed border-gray-300">
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Title (max 22 characters)
                    </label>
                    <Input
                      name="coursetitle"
                      value={courseData.coursetitle}
                      onChange={handleInputChange}
                      required
                      maxLength={22}
                      className="w-full bg-rose-50 border-none"
                      pattern="[a-zA-Z\s]*"
                      title="Only letters and spaces are allowed"
                    />
                    {errors.coursetitle && <p className="text-red-500 text-sm mt-1">{errors.coursetitle}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Category
                    </label>
                    <Select
                      value={courseData.category}
                      onValueChange={(value) => {
                        setCourseData(prev => ({ ...prev, category: value }))
                        setErrors(prev => ({ ...prev, category: '' }))
                      }}
                    >
                      <SelectTrigger className="w-full bg-rose-50 border-none">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-100 border-none">
                        {categories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty
                    </label>
                    <Select
                      value={courseData.difficulty}
                      onValueChange={(value) => {
                        setCourseData(prev => ({ ...prev, difficulty: value }))
                        setErrors(prev => ({ ...prev, difficulty: '' }))
                      }}
                    >
                      <SelectTrigger className="w-full bg-rose-50 border-none">
                        <SelectValue placeholder="Select difficulty level" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-100 border-none">
                        {difficultyLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.difficulty && <p className="text-red-500 text-sm mt-1">{errors.difficulty}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price
                    </label>
                    <Input
                      type="number"
                      name="price"
                      value={courseData.price}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-rose-50 border-none"
                    />
                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Features
                    </label>
                    <Textarea
                      name="features"
                      value={courseData.features}
                      onChange={handleInputChange}
                      required
                      className="w-full min-h-[150px] bg-rose-50 border-none"
                      pattern="[a-zA-Z\s]*"
                      title="Only letters and spaces are allowed"
                    />
                    {errors.features && <p className="text-red-500 text-sm mt-1">{errors.features}</p>}
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Thumbnail Image
                  </label>
                  <div className="bg-rose-50 rounded-lg p-4">
                    <div className="aspect-video w-full rounded-lg border-2 border-dashed border-gray-200 bg-white overflow-hidden">
                      {thumbnailPreview ? (
                        <img
                          src={thumbnailPreview}
                          alt="Course thumbnail"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center">
                          <Upload className="h-12 w-12 text-gray-400 mb-3" />
                          <p className="text-sm text-gray-500">Upload course thumbnail</p>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <Button
                      type="button"
                      onClick={() => document.getElementById('thumbnail-upload').click()}
                      className="mt-4 w-full bg-teal-500 hover:bg-teal-600 text-white"
                    >
                      Add Image
                    </Button>
                  </div>

                  {/* Dynamic Course Structure Section */}
                  <div className="mt-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Structure
                    </label>
                    <div className="bg-rose-50 rounded-lg p-4">
                      <div className="space-y-2">
                        {courseData.courseStructure.map((item, index) => (
                          <>
                            <Input
                              key={index}
                              value={item}
                              onChange={(e) => handleStructureChange(index, e.target.value)}
                              placeholder={`Section ${index + 1}`}
                              className="w-full bg-white border-none"
                            />
                            {errors.courseStructure && errors.courseStructure[index] && (
                              <p className="text-red-500 text-sm mt-1">{errors.courseStructure[index]}</p>
                            )}
                          </>
                        ))}
                        <Button
                          type="button"
                          onClick={addNewSection}
                          className="mt-2 w-full bg-teal-500 hover:bg-teal-600 text-white"
                        >
                          Add Section
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button
                  type="submit"
                  disabled={isUploading || isAddingCourse}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white py-6 text-lg font-medium"
                >
                  {isAddingCourse ? 'Creating Course...' : 'Add Course'}
                </Button>
              </div>
            </form>
          </Card>
        </main>
      </div>
      {isUploading && (
        <LoadingFallback 
          progress={uploadProgress} 
          message="Uploading Thumbnail"
        />
      )}
      {isAddingCourse && (
        <LoadingFallback 
          progress={addCourseProgress} 
          message="Creating Your Course"
        />
      )}
    </div>
  )
}