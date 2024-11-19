// import React, { useState, useEffect } from 'react';
// import { MessageCircle, Send, X } from 'lucide-react';
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Input } from "@/components/ui/input";
// import { useSocket } from '../../context/SocketContext';

// export default function ChatButton({ 
//   tutorId = "default-tutor-id", 
//   tutorName = "Tutor",
//   userId = "default-user-id",
//   userName = "Student"
// }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [chatRoomId, setChatRoomId] = useState(null);
//   const socket = useSocket();

//   useEffect(() => {
//     if (socket) {
//       socket.emit('join', { userId, tutorId });

//       socket.on('message', (newMessage) => {
//         setMessages(prevMessages => [...prevMessages, newMessage]);
//       });

//       return () => {
//         socket.off('message');
//       };
//     }
//   }, [socket, userId, tutorId]);

//   const initializeChat = async () => {
//     try {
//       const response = await fetch('/api/chat/initialize', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           tutorId,
//           userId,
//         }),
//       });
//       const data = await response.json();
//       setChatRoomId(data.chatRoomId);
//       setMessages(data.messages || []);
//     } catch (error) {
//       console.error('Error initializing chat:', error);
//     }
//   };

//   const handleOpen = () => {
//     setIsOpen(true);
//     initializeChat();
//   };

//   const handleClose = () => {
//     setIsOpen(false);
//   };

//   const handleSend = () => {
//     if (message.trim() && socket && chatRoomId) {
//       const messageData = {
//         sender: userId,
//         receiver: tutorId,
//         chatroom: chatRoomId,
//         message: message.trim(),
//       };
//       socket.emit('sendMessage', messageData);
//       setMessages(prevMessages => [...prevMessages, messageData]);
//       setMessage('');
//     }
//   };


//   return (
//     <>
//       <Button
//         onClick={handleOpen}
//         className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
//       >
//         <MessageCircle className="w-5 h-5" />
//         Chat with Tutor
//       </Button>

//       {isOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-t-lg sm:rounded-lg shadow-xl w-full max-w-md flex flex-col h-[600px] sm:h-[500px]">
//             {/* Chat Header */}
//             <div className="p-4 border-b flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <Avatar>
//                   <AvatarImage src="/placeholder-user.jpg" />
//                   <AvatarFallback>{tutorName[0]}</AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <h3 className="font-semibold">{tutorName}</h3>
//                   <p className="text-sm text-muted-foreground">Course Tutor</p>
//                 </div>
//               </div>
//               <Button variant="ghost" size="icon" onClick={handleClose}>
//                 <X className="w-5 h-5" />
//               </Button>
//             </div>

//             {/* Chat Messages */}
//             <ScrollArea className="flex-1 p-4">
//               <div className="space-y-4">
//                 {messages.map((msg, index) => (
//                   <div
//                     key={msg._id || index}
//                     className={`flex ${
//                       msg.sender === userId ? 'justify-end' : 'justify-start'
//                     }`}
//                   >
//                     <div
//                       className={`max-w-[80%] rounded-lg p-3 ${
//                         msg.sender === userId
//                           ? 'bg-blue-600 text-white'
//                           : 'bg-gray-100 text-gray-900'
//                       }`}
//                     >
//                       <p>{msg.message}</p>
//                       <span className="text-xs opacity-70">
//                         {new Date(msg.createdAt).toLocaleTimeString()}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </ScrollArea>

//             {/* Chat Input */}
//             <div className="p-4 border-t">
//               <div className="flex gap-2">
//                 <Input
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   placeholder="Type a message..."
//                   onKeyDown={(e) => {
//                     if (e.key === 'Enter' && !e.shiftKey) {
//                       e.preventDefault()
//                       handleSend()
//                     }
//                   }}
//                 />
//                 <Button onClick={handleSend}>
//                   <Send className="w-5 h-5" />
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   )
// }