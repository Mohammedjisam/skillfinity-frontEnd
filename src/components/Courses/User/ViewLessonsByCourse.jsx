import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "@/AxiosConfig";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Play,
  FileText,
  Clock,
  ChevronLeft,
  MessageCircle,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import ChatForUser from "@/pages/Chat/ChatForUser";
import { useSelector } from "react-redux";
import CustomVideoPlayer from "./CustomVideoPlayer"
import Sidebar from "../../../pages/User/Sidebar";

const ViewLessonsByCourse = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseTitle, setCourseTitle] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasCertificate, setHasCertificate] = useState(false);
  const { courseId } = useParams();
  const [tutor, setTutor] = useState(null);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const userId = useSelector((store) => store.user.userDatas._id)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    fetchLessons();
    checkCertificate();
  }, [courseId]);

  const fetchLessons = async () => {
    try {
      const response = await axiosInstance.get(`/user/data/viewcourselessons/${courseId}`);
      setTutor(response.data.lessons[0].tutor);
      setLessons(response.data.lessons);
      if (response.data.lessons.length > 0) {
        setCourseTitle(response.data.lessons[0].course.coursetitle);
      }
    } catch (error) {
      console.error("Error fetching lessons:", error);
      toast.error("Failed to load lessons. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const checkCertificate = async () => {
    try {
      const response = await axiosInstance.get(`/user/data/certificate/check/${userId}/${courseId}`);
      setHasCertificate(response.data.exists);
    } catch (error) {
      console.error("Error checking certificate:", error);
      toast.error("Failed to check certificate status.");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleWatchVideo = (videoUrl) => {
    setSelectedVideo(videoUrl);
  };

  const handleAttendQuiz = () => {
    navigate(`/quiz/${courseId}`);
  };

  const handleDownloadPdf = async (pdfUrl) => {
    try {
      if (!pdfUrl) {
        toast.error("PDF URL is not available");
        return;
      }
      const downloadUrl = pdfUrl.includes("cloudinary")
        ? `${pdfUrl}?fl_attachment=true`
        : pdfUrl;
      const response = await fetch(downloadUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/pdf",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contentDisposition = response.headers.get("content-disposition");
      let filename = "lesson_notes.pdf";
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download PDF. Please try again.");
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes) return "Duration not specified";
    
    if (minutes < 60) {
      return `${minutes} minutes`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      
      if (remainingMinutes === 0) {
        return `${hours} hour${hours === 1 ? '' : 's'}`;
      }
      
      return `${hours} hour${hours === 1 ? '' : 's'} ${remainingMinutes} minute${remainingMinutes === 1 ? '' : 's'}`;
    }
  };

  if (isChatOpen) {
    return <ChatForUser tutor={tutor} />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} activeItem="Courses" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm lg:hidden">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-label="Toggle sidebar"
            >
              <ChevronLeft className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <Button
                onClick={handleBack}
                variant="ghost"
                className="hover:bg-gray-200 text-gray-800 shadow-sm transition-all duration-300 bg-gray-100"
              >
                <ChevronLeft className="mr-2 h-5 w-5" /> Back to Course
              </Button>
              <div className="flex space-x-4">
                <Button
                  onClick={() => setIsChatOpen(true)}
                  variant="outline"
                  className="bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 shadow-sm transition-all duration-300 flex items-center"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Chat with Tutor
                </Button>
                {!hasCertificate && (
                  <Button
                    onClick={handleAttendQuiz}
                    className="bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
                  >
                    <ClipboardList className="mr-2 h-5 w-5" />
                    Attend Quiz
                  </Button>
                )}
              </div>
            </div>
            <Card className="bg-white shadow-xl border-none rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-gray-100 to-gray-200 p-8">
                <CardTitle className="text-4xl font-bold text-gray-800 tracking-tight">
                  {courseTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {lessons.map((lesson, index) => (
                    <AccordionItem
                      key={lesson._id}
                      value={`item-${index}`}
                      className="mb-4 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-none data-[state=open]:bg-gray-50"
                    >
                      <AccordionTrigger className="text-left py-6 px-6 bg-white hover:bg-gray-50 transition-colors duration-200 [&[data-state=open]>div]:text-gray-900 [&[data-state=open]]:bg-gray-50 hover:no-underline">
                        <div className="flex items-center w-full group">
                          <span className="text-xl font-semibold text-gray-800 group-hover:text-gray-900">
                            {lesson.lessontitle}
                          </span>
                          <span className="ml-auto text-sm text-gray-500 flex items-center">
                            <Clock className="w-5 h-5 mr-2" />
                            {formatDuration(lesson.duration)}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6">
                        <p className="mb-6 text-gray-700 leading-relaxed">
                          {lesson.description}
                        </p>
                        <div className="flex flex-wrap gap-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                className="flex items-center bg-gray-800 hover:bg-gray-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                                onClick={() => handleWatchVideo(lesson.Video)}
                              >
                                <Play className="mr-2 h-5 w-5" /> Watch Video
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[800px] bg-white rounded-2xl p-0 overflow-hidden border-none">
                              <DialogHeader className="p-6 bg-gradient-to-r from-gray-100 to-gray-200">
                                <DialogTitle className="flex justify-between items-center text-gray-800 text-2xl font-bold">
                                  <span>{lesson.lessontitle}</span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSelectedVideo(null)}
                                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full"
                                  ></Button>
                                </DialogTitle>
                              </DialogHeader>
                              <div className="p-6">
                                <CustomVideoPlayer src={selectedVideo} />
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="outline"
                            className="flex items-center bg-white hover:bg-gray-100 text-gray-800 shadow-md hover:shadow-lg transition-all duration-300 border-none"
                            onClick={() => handleDownloadPdf(lesson.pdfnotes)}
                          >
                            <FileText className="mr-2 h-5 w-5" /> Download PDF Notes
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ViewLessonsByCourse;