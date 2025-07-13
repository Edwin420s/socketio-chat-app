import { useSocketContext } from '../context/SocketContext.jsx'

export default function TypingIndicator() {
  const { typingUsers, username } = useSocketContext()

  if (typingUsers.length === 0) return null

  const typingText = typingUsers.length === 1
    ? `${typingUsers[0]} is typing...`
    : `${typingUsers.slice(0, -1).join(', ')} and ${typingUsers.slice(-1)[0]} are typing...`

  return (
    <div className="typing-indicator">
      {typingText}
    </div>
  )
}