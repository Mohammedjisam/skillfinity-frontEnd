// 'use client'

// import React, { useState } from "react";
// // import { BsEmojiSmileFill } from "react-icons/bs";
// // import { IoMdSend } from "react-icons/io";
// // import Picker from "emoji-picker-react";

// export default function ChatInput({ handleSendMsg }) {
//   const [msg, setMsg] = useState("");
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);

//   const handleEmojiPickerhideShow = () => {
//     setShowEmojiPicker(!showEmojiPicker);
//   };

//   const handleEmojiClick = (event, emojiObject) => {
//     let message = msg;
//     message += emojiObject.emoji;
//     setMsg(message);
//   };

//   const sendChat = (event) => {
//     event.preventDefault();
//     if (msg.length > 0) {
//       handleSendMsg(msg);
//       setMsg("");
//     }
//   };

//   return (
//     <div className="grid grid-cols-[5%_95%] items-center bg-[#080420] px-8 py-4 md:px-4 md:gap-4">
//       <div className="flex items-center text-white gap-4">
//         <div className="relative">
          
//         </div>
//       </div>
//       <form className="w-full rounded-full flex items-center gap-8 bg-white bg-opacity-20" onSubmit={sendChat}>
//         <input
//           type="text"
//           placeholder="Type your message here"
//           onChange={(e) => setMsg(e.target.value)}
//           value={msg}
//           className="w-[90%] h-[60%] bg-transparent text-white border-none pl-4 text-lg focus:outline-none selection:bg-[#9a86f3]"
//         />
//         <button
//           type="submit"
//           className="py-1 px-8 rounded-full flex justify-center items-center bg-[#9a86f3] border-none md:px-4"
//         >heelo
//         </button>
//       </form>
//     </div>
//   );
// }