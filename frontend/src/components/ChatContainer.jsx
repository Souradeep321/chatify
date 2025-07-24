import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { useAuthStore } from '../store/useAuthStore';
import { formatMessageTime } from '../lib/utils';

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser, unsubscribeFromMessages, subscribeToMessages, isImageLoading } = useChatStore();
  const { authUser } = useAuthStore();

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);


  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => {
      unsubscribeFromMessages();
    }
  }, [selectedUser._id, getMessages])

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"
              }`}
          >
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  src={message.senderId === authUser._id ? authUser.avatar.url || "/avatar.png" : selectedUser.avatar.url || "/avatar.png"}
                  alt={message.senderId === authUser._id ? authUser.name : selectedUser.name}
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image?.url && (
                <img
                  src={message.image.url}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {isImageLoading && (
        <div className="chat chat-end px-4">
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img src={authUser.avatar.url || "/avatar.png"} alt={authUser.name} />
            </div>
          </div>
          <div className="chat-header mb-1">
            <time className="text-xs opacity-50 ml-1">Uploading...</time>
          </div>
          <div className="chat-bubble bg-gray-100 dark:bg-gray-800 p-0 overflow-hidden">
            <div className="w-[200px] h-[150px] flex items-center justify-center">
              <span className="loading loading-spinner loading-md text-primary"></span>
            </div>
          </div>
        </div>
      )}

      <MessageInput />
    </div>
  )
}

export default ChatContainer