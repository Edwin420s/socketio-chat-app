import { useState, useEffect, useRef } from 'react'
import { useSocketContext } from '../context/SocketContext.jsx'
import Message from './Message.jsx'
import TypingIndicator from './TypingIndicator.jsx'

export default function Chat() {
  const {
    messages,
    sendMessage,
    sendPrivateMessage,
    setTyping,
    activePrivateChat,
    users,
    endPrivateChat
  } = useSocketContext()
  
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  
  const currentRecipient = activePrivateChat 
    ? users.find(u => u.id === activePrivateChat)?.username 
    : null

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!message.trim()) return
    
    if (activePrivateChat) {
      sendPrivateMessage(activePrivateChat, message)
    } else {
      sendMessage(message)
    }
    
    setMessage('')
    setIsTyping(false)
    setTyping(false)
  }

  const handleKeyDown = () => {
    if (!isTyping) {
      setIsTyping(true)
      setTyping(true)
    }
  }

  const handleKeyUp = () => {
    if (isTyping && !message) {
      setIsTyping(false)
      setTyping(false)
    }
  }

  return (
    <div className="chat-container">
      {activePrivateChat && (
        <div className="private-chat-header">
          <h3>Private chat with {currentRecipient}</h3>
          <button onClick={endPrivateChat}>Exit Private Chat</button>
        </div>
      )}
      
      <div className="messages">
        {messages.map(msg => (
          <Message key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <TypingIndicator />
      
      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          placeholder={activePrivateChat 
            ? `Message ${currentRecipient}...` 
            : "Message everyone..."}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}