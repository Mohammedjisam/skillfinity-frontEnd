// import React, { createContext, useContext, useEffect, useState } from 'react';
// import io from 'socket.io-client';

// const SocketContext = createContext();

// export const useSocket = () => useContext(SocketContext);

// export const SocketProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     const newSocket = io('https://anonymous10.cloud', {
//       transports: ['websocket'],
//       rejectUnauthorized: false, // Only use this if you're using a self-signed certificate
//       secure: true,
//       reconnection: true,
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//     });

//     newSocket.on('connect', () => {
//       console.log('Connected to socket server');
//     });

//     newSocket.on('connect_error', (error) => {
//       console.error('Connection error:', error);
//       // You can add custom error handling here
//     });

//     newSocket.on('disconnect', (reason) => {
//       console.log('Disconnected:', reason);
//     });

//     setSocket(newSocket);

//     return () => {
//       newSocket.close();
//     };
//   }, []);

//   return (
//     <SocketContext.Provider value={socket}>
//       {children}
//     </SocketContext.Provider>
//   );
// };