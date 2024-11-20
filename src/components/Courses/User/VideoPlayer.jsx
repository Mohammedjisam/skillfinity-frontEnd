// 'use client'

// import React, { useState, useEffect, useRef } from 'react'
// import ReactPlayer from 'react-player'
// import { Button } from "@/components/ui/button"
// import { Slider } from "@/components/ui/slider"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Play, Pause, Volume2, VolumeX, Settings, Maximize } from 'lucide-react'

// export default function EnhancedVideoPlayer({ videoUrl }) {
//   const [playing, setPlaying] = useState(false)
//   const [volume, setVolume] = useState(0.7)
//   const [muted, setMuted] = useState(false)
//   const [played, setPlayed] = useState(0)
//   const [duration, setDuration] = useState(0)
//   const [seeking, setSeeking] = useState(false)
//   const [playbackRate, setPlaybackRate] = useState(1)
//   const [quality, setQuality] = useState('auto')
//   const [showControls, setShowControls] = useState(false)
//   const playerRef = useRef(null)
//   const containerRef = useRef(null)

//   useEffect(() => {
//     const handleMouseMove = () => {
//       setShowControls(true)
//       clearTimeout(timer)
//       timer = setTimeout(() => setShowControls(false), 3000)
//     }

//     const handleMouseLeave = () => {
//       clearTimeout(timer)
//       setShowControls(false)
//     }

//     let timer
//     const container = containerRef.current
//     container.addEventListener('mousemove', handleMouseMove)
//     container.addEventListener('mouseleave', handleMouseLeave)

//     return () => {
//       container.removeEventListener('mousemove', handleMouseMove)
//       container.removeEventListener('mouseleave', handleMouseLeave)
//       clearTimeout(timer)
//     }
//   }, [])

//   const handlePlayPause = () => setPlaying(!playing)
//   const handleVolumeChange = (value) => setVolume(value[0])
//   const handleToggleMute = () => setMuted(!muted)
//   const handleSeekChange = (value) => setPlayed(value[0])
//   const handleSeekMouseDown = () => setSeeking(true)
//   const handleSeekMouseUp = (value) => {
//     setSeeking(false)
//     playerRef.current.seekTo(value[0])
//   }
//   const handleProgress = (state) => {
//     if (!seeking) {
//       setPlayed(state.played)
//     }
//   }
//   const handleDuration = (duration) => setDuration(duration)
//   const handlePlaybackRateChange = (value) => setPlaybackRate(parseFloat(value))
//   const handleQualityChange = (value) => setQuality(value)

//   const formatTime = (seconds) => {
//     const date = new Date(seconds * 1000)
//     const hh = date.getUTCHours()
//     const mm = date.getUTCMinutes()
//     const ss = date.getUTCSeconds().toString().padStart(2, '0')
//     if (hh) {
//       return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`
//     }
//     return `${mm}:${ss}`
//   }

//   const handleFullscreen = () => {
//     if (containerRef.current) {
//       if (containerRef.current.requestFullscreen) {
//         containerRef.current.requestFullscreen()
//       } else if (containerRef.current.mozRequestFullScreen) {
//         containerRef.current.mozRequestFullScreen()
//       } else if (containerRef.current.webkitRequestFullscreen) {
//         containerRef.current.webkitRequestFullscreen()
//       } else if (containerRef.current.msRequestFullscreen) {
//         containerRef.current.msRequestFullscreen()
//       }
//     }
//   }

//   return (
//     <div ref={containerRef} className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
//       <ReactPlayer
//         ref={playerRef}
//         url={videoUrl}
//         width="100%"
//         height="100%"
//         playing={playing}
//         volume={volume}
//         muted={muted}
//         playbackRate={playbackRate}
//         onProgress={handleProgress}
//         onDuration={handleDuration}
//         config={{
//           file: {
//             attributes: {
//               controlsList: 'nodownload'
//             },
//             forceVideo: true,
//             forceHLS: true,
//             forceDASH: true,
//             hlsOptions: {
//               maxLoadingDelay: 4,
//               minAutoBitrate: 0,
//               lowLatencyMode: true,
//             },
//           }
//         }}
//         className="absolute top-0 left-0"
//       />
      
//       {(showControls || !playing) && (
//         <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-4">
//           <Slider
//             value={[played]}
//             max={1}
//             step={0.01}
//             onValueChange={handleSeekChange}
//             onPointerDown={handleSeekMouseDown}
//             onPointerUp={handleSeekMouseUp}
//             className="w-full mb-4"
//           />
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <Button variant="ghost" size="icon" onClick={handlePlayPause} className="text-white hover:bg-gray-700">
//                 {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
//               </Button>
//               <div className="flex items-center space-x-2">
//                 <Button variant="ghost" size="icon" onClick={handleToggleMute} className="text-white hover:bg-gray-700">
//                   {muted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
//                 </Button>
//                 <Slider
//                   value={[volume]}
//                   max={1}
//                   step={0.1}
//                   onValueChange={handleVolumeChange}
//                   className="w-24"
//                 />
//               </div>
//               <span className="text-sm text-gray-300">
//                 {formatTime(played * duration)} / {formatTime(duration)}
//               </span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Select onValueChange={handlePlaybackRateChange} value={playbackRate.toString()}>
//                 <SelectTrigger className="w-[90px] bg-gray-800 text-white border-gray-700">
//                   <SelectValue placeholder="Speed" />
//                 </SelectTrigger>
//                 <SelectContent className="bg-gray-800 text-white border-gray-700">
//                   <SelectItem value="0.5">0.5x</SelectItem>
//                   <SelectItem value="1">1x</SelectItem>
//                   <SelectItem value="1.5">1.5x</SelectItem>
//                   <SelectItem value="2">2x</SelectItem>
//                 </SelectContent>
//               </Select>
//               <Select onValueChange={handleQualityChange} value={quality}>
//                 <SelectTrigger className="w-[90px] bg-gray-800 text-white border-gray-700">
//                   <SelectValue placeholder="Quality" />
//                 </SelectTrigger>
//                 <SelectContent className="bg-gray-800 text-white border-gray-700">
//                   <SelectItem value="auto">Auto</SelectItem>
//                   <SelectItem value="1080p">1080p</SelectItem>
//                   <SelectItem value="720p">720p</SelectItem>
//                   <SelectItem value="480p">480p</SelectItem>
//                 </SelectContent>
//               </Select>
//               <Button variant="ghost" size="icon" onClick={handleFullscreen} className="text-white hover:bg-gray-700">
//                 <Maximize className="h-6 w-6" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }