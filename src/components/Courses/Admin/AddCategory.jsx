import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '../../../pages/Admin/AdminSideBar'
import axiosInstance from '@/AxiosConfig'
import 'react-toastify/dist/ReactToastify.css'
import { toast } from 'sonner'
import { addCategory } from '@/redux/slice/CategorySlice'
import { useDispatch } from 'react-redux'
import { Menu, X } from 'lucide-react'

export default function AddCategory() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  })
  const [errors, setErrors] = useState({
    title: '',
    description: ''
  })
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const validateInput = (name, value) => {
    // Regex to allow letters, spaces, and specific special characters
    const regex = /^[a-zA-Z\s@#_\-!$%^&*()+=,.?":{}|<>]*$/; 
  
    if (!regex.test(value)) {
      setErrors(prev => ({
        ...prev,
        [name]: 'Only letters, spaces, and allowed special characters are permitted'
      }));
      return false;
    }
  
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target
    if (validateInput(name, value)) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (errors.title || errors.description) {
      toast.error('Please correct the errors before submitting')
      return
    }
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Title and description are required')
      return
    }
    try {
      const response = await axiosInstance.post(
        '/admin/addcategory',
        formData,
        { withCredentials: true }
      )
      if(response.data){
        dispatch(addCategory(response.data.categoryData))
        navigate("/admin/category")
        toast.success(response.data.message)
      } else {
        toast.error('No data received from server')
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Category Adding failed'
      console.error(errorMessage)
      toast.error(errorMessage)
    }
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-grow">
        <header className="bg-white shadow-md p-4 flex justify-between items-center lg:hidden">
          <h1 className="text-xl font-bold">Add New Category</h1>
          <button onClick={toggleSidebar} className="text-gray-600" aria-label="Toggle sidebar">
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </header>
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 hidden lg:block">Add New Category</h1>
            <button 
              onClick={toggleSidebar} 
              className="text-gray-600 lg:hidden" 
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Category Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  maxLength={20} 
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}