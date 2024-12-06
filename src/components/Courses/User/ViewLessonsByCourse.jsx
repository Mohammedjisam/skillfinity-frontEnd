import React, { useState, useEffect, useRef, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import ReactPlayer from "react-player"
import axiosInstance from "@/AxiosConfig"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, SkipBack, SkipForward, ChevronLeft, Clock, CheckCircle2, Circle, FileText, Download, MessageCircle, ClipboardList } from 'lucide-react'
import { Slider } from "@/components/ui/slider"
import { toast } from "sonner"
import { useSelector, useDispatch } from "react-redux"
import { updateCourseProgress } from '../../../redux/slice/CourseSlice'
import ChatForUser from "@/pages/Chat/ChatForUser"

export default function ViewLessonsByCourse() {
  const [lessons, setLessons] = useState([])
  const [watchedLessons, setWatchedLessons] = useState({})
  const [loading, setLoading] = useState(true)
  const [tutor, setTutor] = useState(null);
  const [courseTitle, setCourseTitle] = useState("")
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [progress, setProgress] = useState(0)
  const [lessonProgressMap, setLessonProgressMap] = useState({})
  const { courseId } = useParams()
  const navigate = useNavigate()
  const userId = useSelector((store) => store.user.userDatas._id)
  const dispatch = useDispatch()
  const debounceTimeoutRef = useRef(null)

  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isFullCourseCompleted, setIsFullCourseCompleted] = useState(false)

  // Video player states
  const playerRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    fetchLessons()
  }, [courseId])

  const fetchLessons = async () => {
    try {
      // Fetch lessons
      const lessonsResponse = await axiosInstance.get(`/user/data/viewcourselessons/${courseId}`)
      setLessons(lessonsResponse.data.lessons)
      setTutor(lessonsResponse.data.lessons[0].tutor);
      if (lessonsResponse.data.lessons.length > 0) {
        setCourseTitle(lessonsResponse.data.lessons[0].course.coursetitle)
        setSelectedVideo(lessonsResponse.data.lessons[0].Video)
        setSelectedLesson(lessonsResponse.data.lessons[0])
      }

      // Fetch lesson progress
      const progressResponse = await axiosInstance.get(`/user/courseProgress/${userId}/${courseId}`)
      
      // Create a map of lesson progress
      const progressMap = progressResponse.data.lessonProgress.reduce((acc, lessonProgress) => {
        acc[lessonProgress.lesson] = {
          percentWatched: lessonProgress.percentWatched || 0,
          isCompleted: lessonProgress.isCompleted || false,
          totalWatchTime: lessonProgress.totalWatchTime || 0
        }
        return acc
      }, {})

      setLessonProgressMap(progressMap)
      setProgress(progressResponse.data.courseProgressPercentage)

      // Check if all lessons are completed
      const allLessonsCompleted = lessonsResponse.data.lessons.every(
        lesson => progressMap[lesson._id]?.isCompleted
      )
      setIsFullCourseCompleted(allLessonsCompleted)

    } catch (error) {
      console.error("Error fetching lessons or progress:", error)
      toast.error("Failed to load course content. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const updateLessonProgress = useCallback(async (lessonId, progressData) => {
    try {
      const payload = {
        percentWatched: progressData.percentWatched,
        totalWatchTime: progressData.totalWatchTime,
        isCompleted: progressData.percentWatched >= 90
      }
  
      const response = await axiosInstance.post('/user/updateLessonProgress', {
        userId,
        courseId,
        lessonId,
        progress: payload
      })
  
      // Update local lesson progress map
      setLessonProgressMap(prev => ({
        ...prev,
        [lessonId]: {
          ...payload,
          isCompleted: payload.isCompleted
        }
      }))
  
      // Update Redux store with new progress
      dispatch(updateCourseProgress({
        courseId,
        lessonId,
        progress: payload
      }))
  
      // Refetch course progress to update overall progress
      const progressResponse = await axiosInstance.get(`/user/courseProgress/${userId}/${courseId}`)
      setProgress(progressResponse.data.courseProgressPercentage)

      // Check if all lessons are completed
      const allLessonsCompleted = lessons.every(
        lesson => lessonProgressMap[lesson._id]?.isCompleted || (lesson._id === lessonId && payload.isCompleted)
      )
      setIsFullCourseCompleted(allLessonsCompleted)

    } catch (error) {
      console.error("Error updating lesson progress:", error)
      toast.error("Failed to update lesson progress. Please try again.")
    }
  }, [userId, courseId, dispatch, lessons, lessonProgressMap])

  const handleProgress = useCallback((state) => {
    setCurrentTime(state.playedSeconds)
    
    if (selectedLesson) {
      const percentWatched = Math.round(state.played * 100)
      const totalWatchTime = Math.round(state.playedSeconds)
      
      // Clear existing timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }

      // Set new timeout
      debounceTimeoutRef.current = setTimeout(() => {
        const currentProgress = lessonProgressMap[selectedLesson._id]?.percentWatched || 0
        const currentWatchTime = lessonProgressMap[selectedLesson._id]?.totalWatchTime || 0

        // Only update if the new progress is higher
        if (percentWatched > currentProgress || totalWatchTime > currentWatchTime) {
          updateLessonProgress(selectedLesson._id, {
            percentWatched: Math.max(percentWatched, currentProgress),
            totalWatchTime: Math.max(totalWatchTime, currentWatchTime)
          })
        }
      }, 1000) // Debounce for 1 second
    }
  }, [selectedLesson, lessonProgressMap, updateLessonProgress])

  const handleBack = () => {
    navigate(-1)
  }

  const handleLessonSelect = (lesson) => {
    setSelectedVideo(lesson.Video)
    setSelectedLesson(lesson)
    setIsPlaying(true)
  }

  // Video player functions
  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const renderLessonList = () => {
    return lessons.map((lesson) => {
      const lessonProgress = lessonProgressMap[lesson._id] || {}
      const isWatched = lessonProgress.isCompleted

      return (
        <button
          key={lesson._id}
          onClick={() => handleLessonSelect(lesson)}
          className={`w-full text-left p-3 rounded-lg mb-2 flex items-start gap-3 transition-colors ${
            selectedLesson?._id === lesson._id
              ? "bg-blue-50 text-blue-600 shadow-md"
              : "hover:bg-gray-50 text-gray-700"
          }`}
        >
          <div className="mt-1">
            {isWatched ? (
              <CheckCircle2 className="h-5 w-5 text-primary" />
            ) : (
              <Circle className="h-5 w-5 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{lesson.lessontitle}</p>
            <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {lesson.duration} min
              </div>
              {lessonProgress.percentWatched > 0 && (
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {lessonProgress.percentWatched}% watched
                </span>
              )}
            </div>
          </div>
        </button>
      )
    })
  }

  const handleDuration = (duration) => {
    setDuration(duration)
  }

  const handleSeek = (value) => {
    const newTime = value[0]
    playerRef.current.seekTo(newTime)
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (value) => {
    const newVolume = value[0]
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    setVolume(isMuted ? 1 : 0)
  }

  const handleSpeedChange = (speed) => {
    setPlaybackRate(speed)
    setShowSettings(false)
  }

  const skipForward = () => {
    playerRef.current.seekTo(currentTime + 10)
  }

  const skipBackward = () => {
    playerRef.current.seekTo(currentTime - 10)
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const handleViewPdf = () => {
    if (selectedLesson && selectedLesson.pdfnotes) {
      window.open(selectedLesson.pdfnotes, '_blank')
    } else {
      toast.error("PDF notes are not available for this lesson.")
    }
  }

  const handleDownloadPdf = async () => {
    if (selectedLesson && selectedLesson.pdfnotes) {
      try {
        const response = await fetch(selectedLesson.pdfnotes)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${selectedLesson.lessontitle}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } catch (error) {
        console.error("Error downloading PDF:", error)
        toast.error("Failed to download PDF. Please try again.")
      }
    } else {
      toast.error("PDF notes are not available for this lesson.")
    }
  }

  const handleAttendQuiz = () => {
    navigate(`/quiz/${courseId}`);
  }

  if (isChatOpen) {
    return <ChatForUser tutor={tutor} />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button
            onClick={handleBack}
            variant="ghost"
            className="text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-semibold text-gray-900 truncate max-w-[60%]">{courseTitle}</h1>
          <div className="w-20" /> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-80 bg-white rounded-lg shadow-lg mb-6 lg:mb-0">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">{courseTitle}</h2>
              <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                <span>{lessons.length} lessons</span>
                <span>{Math.round(progress)}% completed</span>
              </div>
              <div className="mt-2">
                <Progress value={progress} className="h-2 bg-blue-100" indicatorClassName="bg-blue-500" />
                <p className="text-sm text-gray-500 mt-1">{progress}% Complete</p>
              </div>
            </div>
            <ScrollArea className="h-[50vh] lg:h-[calc(100vh-13rem)]">
              <div className="p-4">
                {renderLessonList()}
              </div>
            </ScrollArea>
          </div>

          {/* Video Player and Controls */}
          <div className="flex-1">
            {/* Chat and Quiz Buttons */}
            <div className="mb-4 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
              <Button
                onClick={() => setIsChatOpen(true)}
                variant="outline"
                className="w-full sm:w-auto bg-white hover:bg-blue-50 text-blue-600 shadow-sm transition-all duration-300 flex items-center justify-center"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Chat with Tutor
              </Button>
              {isFullCourseCompleted && (
                <Button
                  onClick={handleAttendQuiz}
                  className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                >
                  <ClipboardList className="mr-2 h-5 w-5" />
                  Attend Quiz
                </Button>
              )}
            </div>

            {/* Video Player */}
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video shadow-xl">
              <ReactPlayer
                ref={playerRef}
                url={selectedVideo}
                width="100%"
                height="100%"
                playing={isPlaying}
                volume={volume}
                muted={isMuted}
                playbackRate={playbackRate}
                onProgress={handleProgress}
                onDuration={handleDuration}
              />

              {/* Video Controls */}
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                {/* Progress Bar */}
                <div className="px-4 pt-8">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/80">{formatTime(currentTime)}</span>
                    <Slider
                      value={[currentTime]}
                      max={duration}
                      step={1}
                      onValueChange={handleSeek}
                      className="w-full"
                    />
                    <span className="text-xs text-white/80">{formatTime(duration)}</span>
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
                      onClick={() => {
                        if (playerRef.current) {
                          playerRef.current.getInternalPlayer().requestFullscreen()
                        }
                      }}
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

            {/* Lesson Info */}
            {selectedLesson && (
              <div className="mt-6 bg-white rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {selectedLesson.lessontitle}
                </h2>
                <p className="text-gray-600 mb-6">{selectedLesson.description}</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={handleViewPdf} className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white w-full sm:flex-1 shadow-md">
                    <FileText className="mr-2 h-4 w-4" />
                    View PDF Notes
                  </Button>
                  <Button onClick={handleDownloadPdf} variant="outline" className="flex items-center justify-center bg-white hover:bg-gray-50 text-blue-500 w-full sm:flex-1 shadow-md">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF Notes
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {isChatOpen && (
        <ChatForUser onClose={() => setIsChatOpen(false)} />
      )}
    </div>
  )
}

