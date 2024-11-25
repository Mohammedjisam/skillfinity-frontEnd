import React, { useState, useEffect } from "react";

export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 border-r border-gray-200">
      <div className="bg-primary p-6 shadow-md">
        <h3 className="text-3xl font-bold text-gray-800 tracking-wide">CHAT</h3>
      </div>
      <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {contacts?.users && contacts.users.length > 0 ? (
          contacts.users.map((contact, index) => (
            <div
              key={contact._id}
              className={`p-4 cursor-pointer transition-all duration-300 ease-in-out ${
                index === currentSelected
                  ? "bg-primary text-gray-800 shadow-md"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => changeCurrentChat(index, contact)}
            >
              <div className="flex items-center space-x-4">
                <div 
                  key={`avatar-${contact._id}`}
                  className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-xl font-semibold text-gray-600"
                >
                  {contact.name.charAt(0).toUpperCase()}
                </div>
                <div key={`name-${contact._id}`}>
                  <h3 className="text-lg font-semibold">{contact.name}</h3>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-xl font-semibold">No contacts available</p>
            <p className="mt-2">Start adding contacts to chat with them</p>
          </div>
        )}
      </div>
    </div>
  );
}

