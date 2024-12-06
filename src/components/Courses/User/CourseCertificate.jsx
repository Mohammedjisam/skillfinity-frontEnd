import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Sidebar from '../../../pages/User/Sidebar'
import { Download, Menu } from 'lucide-react'
import axiosInstance from '@/AxiosConfig'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

import logoImage from '../../../../public/logo-black-Photoroom.svg'
import signatureImage from '../../../../public/signature (1).png'
import sealImage from '../../../../public/Black And White Modern Marketing Agency Round Stamp Business Logo.png'

const CourseCertificate = () => {
  const [certificateData, setCertificateData] = useState(null)
  const [error, setError] = useState(null)
  const { courseId } = useParams()
  const userId = useSelector((store) => store.user.userDatas?._id)
  const tutorData = useSelector((store) => store.tutor.tutorDatas)
  const certificateRef = useRef(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  useEffect(() => {
    const fetchCertificate = async () => {
      if (!userId) {
        setError('User ID not found. Please log in again.')
        return
      }
      try {
        const response = await axiosInstance.get(`/user/data/certificate/${courseId}/${userId}`)
        setCertificateData(response.data.certificateData)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch certificate')
      }
    }

    fetchCertificate()
  }, [courseId, userId])

  const handleDownload = async () => {
    if (!certificateRef.current) return

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        logging: false,
        useCORS: true
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      })

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
      pdf.save(`${certificateData?.studentName}-Certificate.pdf`)
    } catch (err) {
      console.error('Error generating PDF:', err)
    }
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  if (!certificateData || !tutorData) {
    return <div className="text-center">Loading certificate...</div>
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} activeItem="Certifications" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm lg:hidden">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div ref={certificateRef} className="w-full max-w-5xl mx-auto">
              <Card className="relative w-full aspect-[1.4142/1] bg-white shadow-2xl overflow-hidden">
                {/* Certificate Content Container */}
                <div className="absolute inset-0 p-8 sm:p-12 md:p-16 flex flex-col">
                  {/* Border Frame */}
                  <div className="absolute inset-4 sm:inset-8 md:inset-12 border-2 border-emerald-500/30"></div>
                  
                  {/* Logo */}
                  <div className="relative z-10 mb-6 sm:mb-8">
                    <img
                      src={logoImage}
                      alt="EduSphere Logo"
                      className="w-20 sm:w-24 md:w-28 h-auto"
                    />
                  </div>

                  {/* Certificate Content */}
                  <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 space-y-4 sm:space-y-6 md:space-y-8">
                    <div>
                      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-emerald-600">
                        CERTIFICATE
                      </h1>
                      <p className="text-sm sm:text-base md:text-lg text-emerald-500/80 uppercase tracking-[0.2em]">
                        OF COMPLETION
                      </p>
                    </div>

                    <div className="max-w-2xl mx-auto">
                      <p className="text-sm sm:text-base md:text-lg text-gray-600">
                        THIS CERTIFICATE IS PROUDLY PRESENTED TO
                      </p>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-script text-emerald-600 mt-2 mb-1">
                        {certificateData.studentName}
                      </h2>
                      <div className="w-32 sm:w-40 md:w-48 h-0.5 bg-emerald-500/30 mx-auto"></div>
                    </div>

                    <div className="max-w-2xl mx-auto">
                      <p className="text-sm sm:text-base text-gray-600">
                        for successfully completing the course
                      </p>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-emerald-600 mt-2">
                        {certificateData.courseName}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base text-gray-600">with a score of</span>
                      <span className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-600">
                        {certificateData.score}%
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="relative z-10 mt-auto">
                    <div className="grid grid-cols-3 gap-4 items-end">
                      <div className="text-center">
                        <p className="text-sm sm:text-base md:text-lg font-semibold text-emerald-600 mb-1">
                          {tutorData.name || 'Instructor Name'}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">Course Instructor</p>
                      </div>

                      <div className="text-center">
                        <img
                          src={signatureImage}
                          alt="CEO Signature"
                          className="h-6 sm:h-4 md:h-5 w-auto mx-auto mb-2"
                        />
                        <p className="text-xs sm:text-sm text-gray-600">Skillfinity CEO</p>
                      </div>

                      <div className="text-center">
                        <div className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 mx-auto mb-2">
                          <img
                            src={sealImage}
                            alt="Company Seal"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 transform rotate-45 translate-x-32 -translate-y-32"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-50/50 transform rotate-45 -translate-x-32 translate-y-32"></div>
                </div>
              </Card>
            </div>

            {/* Download Button */}
            <div className="mt-8 flex justify-center">
              <Button 
                onClick={handleDownload}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3"
              >
                <Download className="mr-2 h-5 w-5" />
                Download Certificate
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default CourseCertificate