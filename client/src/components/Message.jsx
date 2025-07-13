import { useSocketContext } from '../context/SocketContext.jsx'
import { useEffect, useRef } from 'react'

export default function Message({ message }) {
  const { username, markMessageAsRead, activePrivateChat } = useSocketContext()
  const messageRef = useRef()

  useEffect(() => {
    if (messageRef.current && !message.readBy?.includes(username) && message.sender !== username) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            markMessageAsRead(message.id)
            observer.unobserve(entry.target)
          }
        },
        { threshold: 0.5 }
      )

      observer.observe(messageRef.current)
      return () => observer.unobserve(messageRef.current)
    }
  }, [message, username, markMessageAsRead])

  const isPrivate = message.isPrivate || (activePrivateChat && message.senderId === activePrivateChat)
  const isSystem = message.system
  const isYou = message.sender === username

  return (
    <div
      ref={messageRef}
      className={`message ${isYou ? 'you' : ''} ${isPrivate ? 'private' : ''} ${isSystem ? 'system' : ''}`}
    >
      {!isSystem && !isYou && <span className="sender">{message.sender}</span>}
      <div className="content">
        {isSystem ? (
          <em>{message.message}</em>
        ) : (
          message.message
        )}
      </div>
      <div className="meta">
        <span className="time">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
        {isPrivate && <span className="private-label">Private</span>}
      </div>
    </div>
  )
}