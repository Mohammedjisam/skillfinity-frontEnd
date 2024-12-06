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
  const userId = useSelector((store) => store.user.userDatas._id)
  const tutorName = useSelector((store) => store.tutor.tutorDatas)
  const certificateRef = useRef(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  useEffect(() => {
    const fetchCertificate = async () => {
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

  if (!certificateData) {
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
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div ref={certificateRef} className="w-full max-w-4xl mx-auto">
              <Card className="relative w-full aspect-[1.5/1] bg-white shadow-2xl overflow-hidden">
                {/* Main Border Frame */}
                <div className="absolute inset-4 sm:inset-6 md:inset-8 border-2 border-emerald-500/30">
                  {/* Corner Decorations */}
                  <div className="absolute -top-1 -left-1 w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 border-t-2 border-l-2 border-emerald-600"></div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 border-t-2 border-r-2 border-emerald-600"></div>
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 border-b-2 border-l-2 border-emerald-600"></div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 border-b-2 border-r-2 border-emerald-600"></div>
                </div>

                {/* Geometric Accents */}
                <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-emerald-500/10 transform rotate-45 translate-x-16 -translate-y-16 sm:translate-x-24 sm:-translate-y-24 md:translate-x-32 md:-translate-y-32"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-emerald-500/10 transform rotate-45 -translate-x-16 translate-y-16 sm:-translate-x-24 sm:translate-y-24 md:-translate-x-32 md:translate-y-32"></div>

                {/* Logo */}
                <div className="absolute top-4 left-4 sm:top-8 sm:left-8 md:top-12 md:left-12 flex items-center gap-2">
                  <div className="w-12 h-10 sm:w-16 sm:h-12 md:w-20 md:h-16">
                    <img
                      src={logoImage}
                      alt="EduSphere Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Main Content */}
                <div className="relative h-full flex flex-col items-center justify-between p-6 sm:p-10 md:p-16">
                  <div className="text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif text-emerald-600 mb-1 sm:mb-2">CERTIFICATE</h1>
                    <p className="text-sm sm:text-base md:text-xl text-emerald-500/80 uppercase tracking-[0.2em] sm:tracking-[0.3em]">OF COMPLETION</p>
                  </div>

                  <div className="flex flex-col items-center justify-center flex-grow text-center max-w-3xl">
                    <p className="text-sm sm:text-base md:text-xl text-gray-600 mb-2 sm:mb-4">THIS CERTIFICATE IS PROUDLY PRESENTED TO</p>
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-script text-emerald-600 mb-4 sm:mb-6 md:mb-8">
                      {certificateData.studentName}
                      <span className="block w-32 sm:w-40 md:w-48 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto mt-1 sm:mt-2"></span>
                    </h2>

                    <p className="text-xs sm:text-sm md:text-lg text-gray-600 mb-2 sm:mb-4">for successfully completing the course</p>
                    <h3 className="text-xl sm:text-2xl md:text-4xl font-semibold text-emerald-600 mb-4 sm:mb-6 md:mb-8">
                      {certificateData.courseName}
                    </h3>

                    <div className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8 md:mb-12">
                      <p className="text-sm sm:text-base md:text-xl text-gray-600">with a score of</p>
                      <p className="text-xl sm:text-2xl md:text-4xl font-bold text-emerald-600">{certificateData.score}%</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-end w-full px-2 sm:px-4 md:px-8">
                    <div className="text-center">
                      <p className="font-script text-sm sm:text-xl md:text-2xl text-emerald-600 mb-0.5 sm:mb-1">{tutorName}</p>
                      <p className="text-xs md:text-sm text-gray-600">Course Instructor</p>
                    </div>

                    <div className="text-center">
                      <div className="mb-0.5 sm:mb-1">
                        <img
                          src={signatureImage}
                          alt="CEO Signature"
                          className="inline-block w-16 sm:w-24 md:w-32 h-auto"
                        />
                      </div>
                      <p className="text-xs md:text-sm text-gray-600">CEO, Skillfinity</p>
                    </div>

                    <div className="text-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 border-2 sm:border-4 border-emerald-600 rounded-full flex items-center justify-center overflow-hidden">
                        <img
                          src={sealImage}
                          alt="Company Seal"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs md:text-sm text-gray-600 mt-1 sm:mt-2">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>
                </div>

                {/* Outer Frame Lines */}
                <div className="absolute inset-3 sm:inset-4 md:inset-6 border border-emerald-500/20"></div>
                <div className="absolute inset-3.5 sm:inset-5 md:inset-7 border border-emerald-500/20"></div>
              </Card>
            </div>

            {/* Download Button */}
            <div className="mt-6 sm:mt-8 flex justify-center">
              <Button onClick={handleDownload} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base">
                <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
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

