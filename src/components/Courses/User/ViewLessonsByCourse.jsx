import React, { useState, useEffect, useRef } from "react";
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
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  FileText,
  Clock,
  ChevronLeft,
  X,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { toast } from "sonner";
import ChatForUser from "@/pages/Chat/ChatForUser";

const CustomVideoPlayer = ({ src }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("loadedmetadata", handleLoadedMetadata);

      const hideControlsTimer = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 3000);

      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        clearTimeout(hideControlsTimer);
      };
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (value) => {
    const newTime = value[0];
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (value) => {
    const newVolume = value[0];
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
      if (newMutedState) {
        setVolume(0);
      } else {
        setVolume(1);
        videoRef.current.volume = 1;
      }
    }
  };

  const handleSpeedChange = (value) => {
    const newSpeed = parseFloat(value);
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
      setPlaybackRate(newSpeed);
      setShowSettings(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 10;
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 10;
    }
  };

  
  return (
    <div
      ref={containerRef}
      className="relative bg-[#2D1B69] rounded-lg overflow-hidden group aspect-video"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full"
        onClick={togglePlay}
      />

      {/* Center Play Button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          onClick={togglePlay}
          className="w-16 h-16 flex items-center justify-center rounded-full bg-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
        >
          {isPlaying ? (
            <Pause className="h-8 w-8" />
          ) : (
            <Play className="h-8 w-8" />
          )}
        </button>
      </div>

      {/* Video Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Progress Bar */}
        <div className="px-4 pt-8">
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/80">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={handleSeek}
              className="w-full"
            />
            <span className="text-xs text-white/80">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Button
                onClick={toggleMute}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>
              <Slider
                value={[volume]}
                max={1}
                step={0.1}
                onValueChange={handleVolumeChange}
                className="w-20"
              />
            </div>
            <div className="flex items-center gap-1">
              <Button
                onClick={skipBackward}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button
                onClick={togglePlay}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
              <Button
                onClick={skipForward}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Button
                onClick={() => setShowSettings(!showSettings)}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                <Settings className="h-5 w-5" />
              </Button>
              {showSettings && (
                <div className="absolute bottom-full right-0 mb-2 p-3 bg-black/90 rounded-lg min-w-[200px]">
                  <div className="text-sm text-white mb-2">Playback Speed</div>
                  <div className="grid grid-cols-4 gap-1">
                    {[0.5, 1, 1.5, 2].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => handleSpeedChange(speed)}
                        className={`px-2 py-1 rounded ${
                          playbackRate === speed
                            ? "bg-white/20"
                            : "hover:bg-white/10"
                        } text-white text-sm`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Button
              onClick={toggleFullscreen}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
            >
              <Maximize className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ViewLessonsByCourse = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseTitle, setCourseTitle] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { courseId } = useParams();
  const [tutor, setTutor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLessons();
  }, [courseId]);

  const fetchLessons = async () => {
    try {
      const response = await axiosInstance.get(
        `/user/data/viewcourselessons/${courseId}`
      );
      console.log("tutorinte vellom ondoooooooooo===>", response.data);
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between">
          <Button
            onClick={handleBack}
            variant="ghost"
            className="mb-6 hover:bg-gray-200 text-gray-800 shadow-sm transition-all duration-300 bg-gray-100"
          >
            <ChevronLeft className="mr-2 h-5 w-5" /> Back to Course
          </Button>
          <Button
            onClick={() => setIsChatOpen(true)}
            variant="ghost"
            className="mb-6 hover:bg-gray-400 text-gray-800 shadow-sm transition-all duration-300 bg-gray-300"
          >
            Chat with tutor
          </Button>
          <Button
              onClick={handleAttendQuiz}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
            >
              Attend Quiz
            </Button>
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
                        {lesson.duration} min
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
    </div>
  );
};

export default ViewLessonsByCourse;
