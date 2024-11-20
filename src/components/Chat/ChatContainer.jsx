// 'use client'

// import React, { useState, useEffect, useRef } from "react";
// import ChatInput from "./ChatInput";
// // import Logout from "./Logout";
// // import { v4 as uuidv4 } from "uuid";
// import axios from "axios";
// import axiosInstance from "@/AxiosConfig";
// // import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";

// export default function ChatContainer({ currentChat, socket }) {
//   const [messages, setMessages] = useState([]);
//   const scrollRef = useRef();
//   const [arrivalMessage, setArrivalMessage] = useState(null);

//   useEffect(() => {
//     const fetchMessages = async () => {
//     //   const data = await JSON.parse(
//     //     localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
//     //   );
//     const data={
//         id:1
//     }
//       const response = await axiosInstance.post("/tutor/course/chat/getmsg", {
//         from: data._id,
//         to: currentChat._id,
//       });
//       setMessages(response.data);
//     };
//     fetchMessages();
//   }, [currentChat]);

//   useEffect(() => {
//     const getCurrentChat = async () => {
//       if (currentChat) {
//         await JSON.parse(
//           localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
//         )._id;
//       }
//     };
//     getCurrentChat();
//   }, [currentChat]);

//   const handleSendMsg = async (msg) => {
//     const data={
//         id:1
//     }
//     socket.current.emit("send-msg", {
//       to: currentChat._id,
//       from: data._id,
//       msg,
//     });
//     await axiosInstance.post("/tutor/course/chat/addmsg", {
//       from: data._id,
//       to: currentChat._id,
//       message: msg,
//     });

//     const msgs = [...messages];
//     msgs.push({ fromSelf: true, message: msg });
//     setMessages(msgs);
//   };

//   useEffect(() => {
//     if (socket.current) {
//       socket.current.on("msg-recieve", (msg) => {
//         setArrivalMessage({ fromSelf: false, message: msg });
//       });
//     }
//   }, []);

//   useEffect(() => {
//     arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
//   }, [arrivalMessage]);

//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   return (
//     <div className="grid grid-rows-[10%_80%_10%] gap-0.5 overflow-hidden md:grid-rows-[15%_70%_15%]">
//       <div className="flex justify-between items-center px-8 py-4">
//         <div className="flex items-center gap-4">
//           <div className="avatar">
//             <img
//               alt="kemb"
//               className="h-12"
//             />
//           </div>
//           <div className="username">
//             <h3 className="text-white">{currentChat?.username}|| "dummy" </h3>
//           </div>
//         </div>
        
//       </div>
//       <div className="px-8 py-4 flex flex-col gap-4 overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
//         {messages.map((message) => {
//           return (
//             <div ref={scrollRef} key={uuidv4()}>
//               <div
//                 className={`flex items-center ${
//                   message.fromSelf ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 <div className={`max-w-[40%] md:max-w-[70%] break-words p-4 text-lg rounded-2xl ${
//                   message.fromSelf ? "bg-indigo-900 bg-opacity-20" : "bg-purple-900 bg-opacity-20"
//                 }`}>
//                   <p className="text-gray-300">{message.message}</p>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//       <ChatInput handleSendMsg={handleSendMsg} />
//     </div>
//   );
// }