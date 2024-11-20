// 'use client'

// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { io } from "socket.io-client";
// // import { allUsersRoute, host } from "../utils/APIRoutes";
// import ChatContainer from "../../components/Chat/ChatContainer";


// export default function Chat() {
//   const navigate = useNavigate();
//   const socket = useRef();
//   const [contacts, setContacts] = useState([]);
//   const [currentChat, setCurrentChat] = useState(undefined);
//   const [currentUser, setCurrentUser] = useState(undefined);

//   useEffect(() => {
//     // const checkUser = async () => {
//     //   if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
//     //     navigate("/login");
//     //   } else {
//     //     setCurrentUser(
//     //       await JSON.parse(
//     //         localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
//     //       )
//     //     );
//     //   }
//     // };
//     // checkUser();
//   }, [navigate]);

//   useEffect(() => {
//     if (currentUser) {
//       socket.current = io(host);
//       socket.current.emit("add-user", currentUser._id);
//     }
//   }, [currentUser]);

//   useEffect(() => {
//     const fetchContacts = async () => {
//       if (currentUser) {
//         if (currentUser.isAvatarImageSet) {
//           const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
//           setContacts(data.data);
//         } else {
//           navigate("/setAvatar");
//         }
//       }
//     };
//     fetchContacts();
//   }, [currentUser, navigate]);

//   const handleChatChange = (chat) => {
//     setCurrentChat(chat);
//   };

//   return (
//     <div className="h-screen w-screen flex flex-col justify-center items-center gap-4 bg-[#131324]">
//       <div className="h-[85vh] w-[85vw] bg-[#00000076] grid grid-cols-[25%_75%] md:grid-cols-[35%_65%]">
//         {
//           <ChatContainer currentChat={currentChat} socket={socket} />
//         }
//       </div>
//     </div>
//   );
// }